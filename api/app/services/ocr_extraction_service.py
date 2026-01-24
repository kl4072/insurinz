import io
import re
from datetime import datetime
from typing import List, Literal, Optional

import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes

from app.models.extraction import ExtractionResponse, ExtractedField


class OCRExtractionService:
    """
    Document extraction service using Tesseract OCR.
    Extracts text from images and PDFs, then parses insurance-related fields.
    """

    def __init__(self, tesseract_cmd: Optional[str] = None):
        """
        Initialize the OCR service.

        Args:
            tesseract_cmd: Path to tesseract executable.
                           If None, uses system default.
        """
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    async def extract(
        self,
        filename: str,
        content: bytes,
        content_type: str
    ) -> ExtractionResponse:
        """Extract information from a document using OCR."""

        # Extract text from document
        extracted_text = await self._extract_text(content, content_type)

        # Detect document type from content
        document_type = self._detect_document_type(extracted_text, filename)

        # Extract fields based on document type
        extracted_fields = self._extract_fields(extracted_text, document_type)

        # Calculate confidence based on field extraction success
        confidence = self._calculate_confidence(extracted_fields)

        return ExtractionResponse(
            filename=filename,
            document_type=document_type,
            confidence=confidence,
            extracted_fields=extracted_fields,
            processed_at=datetime.utcnow()
        )

    async def _extract_text(self, content: bytes, content_type: str) -> str:
        """Extract text from document using OCR."""

        if content_type == "application/pdf":
            return self._extract_text_from_pdf(content)
        elif content_type in ["image/png", "image/jpeg", "image/jpg"]:
            return self._extract_text_from_image(content)
        else:
            # For Word/Excel, return empty for now (would need additional libraries)
            return ""

    def _extract_text_from_image(self, content: bytes) -> str:
        """Extract text from an image using pytesseract."""
        image = Image.open(io.BytesIO(content))
        text = pytesseract.image_to_string(image)
        return text

    def _extract_text_from_pdf(self, content: bytes) -> str:
        """Extract text from a PDF by converting pages to images."""
        try:
            images = convert_from_bytes(content)
            text_parts = []
            for image in images:
                text = pytesseract.image_to_string(image)
                text_parts.append(text)
            return "\n".join(text_parts)
        except Exception:
            return ""

    def _detect_document_type(
        self,
        text: str,
        filename: str
    ) -> Literal["policy", "claim", "submission", "unknown"]:
        """Detect document type from extracted text and filename."""
        text_lower = text.lower()
        filename_lower = filename.lower()

        # Policy indicators
        policy_keywords = [
            "policy number", "policy no", "policyholder", "policy holder",
            "coverage period", "premium", "declarations", "insured",
            "effective date", "expiration date", "certificate of insurance"
        ]

        # Claim indicators
        claim_keywords = [
            "claim number", "claim no", "date of loss", "claimant",
            "incident report", "accident report", "claim form",
            "loss description", "damage", "adjuster"
        ]

        # Submission/Application indicators
        submission_keywords = [
            "application", "submission", "quote request", "applicant",
            "requested coverage", "proposed insured", "new business"
        ]

        # Count keyword matches
        policy_score = sum(1 for kw in policy_keywords if kw in text_lower)
        claim_score = sum(1 for kw in claim_keywords if kw in text_lower)
        submission_score = sum(1 for kw in submission_keywords if kw in text_lower)

        # Also check filename
        if any(kw in filename_lower for kw in ["policy", "certificate", "coverage"]):
            policy_score += 2
        if any(kw in filename_lower for kw in ["claim", "loss", "incident"]):
            claim_score += 2
        if any(kw in filename_lower for kw in ["submission", "application", "quote"]):
            submission_score += 2

        # Determine type based on highest score
        max_score = max(policy_score, claim_score, submission_score)
        if max_score == 0:
            return "unknown"
        elif policy_score == max_score:
            return "policy"
        elif claim_score == max_score:
            return "claim"
        else:
            return "submission"

    def _extract_fields(
        self,
        text: str,
        document_type: Literal["policy", "claim", "submission", "unknown"]
    ) -> List[ExtractedField]:
        """Extract relevant fields based on document type."""

        fields = []

        if document_type == "policy":
            fields = self._extract_policy_fields(text)
        elif document_type == "claim":
            fields = self._extract_claim_fields(text)
        elif document_type == "submission":
            fields = self._extract_submission_fields(text)
        else:
            fields = [
                ExtractedField(
                    field_name="Raw Text",
                    value=text[:500] + "..." if len(text) > 500 else text,
                    confidence=1.0
                )
            ]

        return fields

    def _extract_policy_fields(self, text: str) -> List[ExtractedField]:
        """Extract policy-related fields from text."""
        fields = []

        # Policy Number patterns
        policy_match = re.search(
            r'policy\s*(?:number|no|#)?[:\s]*([A-Z0-9\-]+)',
            text, re.IGNORECASE
        )
        if policy_match:
            fields.append(ExtractedField(
                field_name="Policy Number",
                value=policy_match.group(1).strip(),
                confidence=0.9
            ))

        # Policyholder name
        holder_match = re.search(
            r'(?:policy\s*holder|insured|named\s*insured)[:\s]*([A-Za-z\s]+)',
            text, re.IGNORECASE
        )
        if holder_match:
            fields.append(ExtractedField(
                field_name="Policy Holder",
                value=holder_match.group(1).strip()[:50],
                confidence=0.85
            ))

        # Dates (effective/expiration)
        date_pattern = r'\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}'
        dates = re.findall(date_pattern, text)
        if len(dates) >= 1:
            fields.append(ExtractedField(
                field_name="Effective Date",
                value=dates[0],
                confidence=0.8
            ))
        if len(dates) >= 2:
            fields.append(ExtractedField(
                field_name="Expiration Date",
                value=dates[1],
                confidence=0.8
            ))

        # Premium amount
        premium_match = re.search(
            r'(?:premium|total)[:\s]*\$?([\d,]+\.?\d*)',
            text, re.IGNORECASE
        )
        if premium_match:
            fields.append(ExtractedField(
                field_name="Premium Amount",
                value=f"${premium_match.group(1)}",
                confidence=0.85
            ))

        return fields

    def _extract_claim_fields(self, text: str) -> List[ExtractedField]:
        """Extract claim-related fields from text."""
        fields = []

        # Claim Number
        claim_match = re.search(
            r'claim\s*(?:number|no|#)?[:\s]*([A-Z0-9\-]+)',
            text, re.IGNORECASE
        )
        if claim_match:
            fields.append(ExtractedField(
                field_name="Claim Number",
                value=claim_match.group(1).strip(),
                confidence=0.9
            ))

        # Date of Loss
        dol_match = re.search(
            r'(?:date\s*of\s*loss|loss\s*date|incident\s*date)[:\s]*(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})',
            text, re.IGNORECASE
        )
        if dol_match:
            fields.append(ExtractedField(
                field_name="Date of Loss",
                value=dol_match.group(1),
                confidence=0.9
            ))

        # Claimant Name
        claimant_match = re.search(
            r'(?:claimant|insured)[:\s]*([A-Za-z\s]+)',
            text, re.IGNORECASE
        )
        if claimant_match:
            fields.append(ExtractedField(
                field_name="Claimant Name",
                value=claimant_match.group(1).strip()[:50],
                confidence=0.85
            ))

        # Claim Amount
        amount_match = re.search(
            r'(?:claim\s*amount|amount|total)[:\s]*\$?([\d,]+\.?\d*)',
            text, re.IGNORECASE
        )
        if amount_match:
            fields.append(ExtractedField(
                field_name="Claim Amount",
                value=f"${amount_match.group(1)}",
                confidence=0.85
            ))

        return fields

    def _extract_submission_fields(self, text: str) -> List[ExtractedField]:
        """Extract submission/application-related fields from text."""
        fields = []

        # Application ID
        app_match = re.search(
            r'(?:application|submission|quote)\s*(?:id|number|no|#)?[:\s]*([A-Z0-9\-]+)',
            text, re.IGNORECASE
        )
        if app_match:
            fields.append(ExtractedField(
                field_name="Application ID",
                value=app_match.group(1).strip(),
                confidence=0.9
            ))

        # Applicant Name
        applicant_match = re.search(
            r'(?:applicant|proposed\s*insured|name)[:\s]*([A-Za-z\s]+)',
            text, re.IGNORECASE
        )
        if applicant_match:
            fields.append(ExtractedField(
                field_name="Applicant Name",
                value=applicant_match.group(1).strip()[:50],
                confidence=0.85
            ))

        # Application Date
        date_pattern = r'\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}'
        dates = re.findall(date_pattern, text)
        if dates:
            fields.append(ExtractedField(
                field_name="Application Date",
                value=dates[0],
                confidence=0.8
            ))

        # Coverage type
        coverage_match = re.search(
            r'(?:coverage|type)[:\s]*([A-Za-z\s]+)',
            text, re.IGNORECASE
        )
        if coverage_match:
            fields.append(ExtractedField(
                field_name="Requested Coverage",
                value=coverage_match.group(1).strip()[:50],
                confidence=0.75
            ))

        return fields

    def _calculate_confidence(self, fields: List[ExtractedField]) -> float:
        """Calculate overall extraction confidence."""
        if not fields:
            return 0.5

        avg_confidence = sum(f.confidence for f in fields) / len(fields)
        # Boost confidence if we found multiple fields
        field_count_bonus = min(len(fields) * 0.02, 0.1)

        return min(round(avg_confidence + field_count_bonus, 2), 0.99)
