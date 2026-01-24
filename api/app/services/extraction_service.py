import random
from datetime import datetime
from typing import List, Literal

from app.models.extraction import ExtractionResponse, ExtractedField


class ExtractionService:
    """
    Document extraction service.
    Currently returns mock data - replace with actual extraction logic.
    """

    async def extract(
        self,
        filename: str,
        content: bytes,
        content_type: str
    ) -> ExtractionResponse:
        """Extract information from a document."""

        # Determine document type based on filename hints
        document_type = self._detect_document_type(filename)

        # Get mock extracted fields based on document type
        extracted_fields = self._get_mock_fields(document_type)

        return ExtractionResponse(
            filename=filename,
            document_type=document_type,
            confidence=round(0.85 + random.random() * 0.14, 2),
            extracted_fields=extracted_fields,
            processed_at=datetime.utcnow()
        )

    def _detect_document_type(
        self,
        filename: str
    ) -> Literal["policy", "claim", "submission", "unknown"]:
        """Detect document type from filename."""
        filename_lower = filename.lower()

        if any(kw in filename_lower for kw in ["policy", "certificate", "coverage"]):
            return "policy"
        elif any(kw in filename_lower for kw in ["claim", "loss", "incident"]):
            return "claim"
        elif any(kw in filename_lower for kw in ["submission", "application", "quote"]):
            return "submission"
        else:
            # Random assignment for demo
            types = ["policy", "claim", "submission"]
            return random.choice(types)

    def _get_mock_fields(
        self,
        document_type: Literal["policy", "claim", "submission", "unknown"]
    ) -> List[ExtractedField]:
        """Return mock extracted fields based on document type."""

        if document_type == "policy":
            return [
                ExtractedField(
                    field_name="Policy Number",
                    value=f"POL-2024-{random.randint(100000, 999999)}",
                    confidence=0.98
                ),
                ExtractedField(
                    field_name="Policy Holder",
                    value="John Smith",
                    confidence=0.95
                ),
                ExtractedField(
                    field_name="Coverage Type",
                    value="Comprehensive Auto Insurance",
                    confidence=0.92
                ),
                ExtractedField(
                    field_name="Effective Date",
                    value="01/15/2024",
                    confidence=0.97
                ),
                ExtractedField(
                    field_name="Expiration Date",
                    value="01/15/2025",
                    confidence=0.97
                ),
                ExtractedField(
                    field_name="Premium Amount",
                    value="$1,250.00",
                    confidence=0.94
                ),
            ]

        elif document_type == "claim":
            return [
                ExtractedField(
                    field_name="Claim Number",
                    value=f"CLM-{random.randint(100000, 999999)}",
                    confidence=0.98
                ),
                ExtractedField(
                    field_name="Date of Loss",
                    value="12/10/2024",
                    confidence=0.96
                ),
                ExtractedField(
                    field_name="Claimant Name",
                    value="John Smith",
                    confidence=0.94
                ),
                ExtractedField(
                    field_name="Loss Description",
                    value="Rear-end collision at intersection",
                    confidence=0.88
                ),
                ExtractedField(
                    field_name="Claim Amount",
                    value="$4,500.00",
                    confidence=0.92
                ),
                ExtractedField(
                    field_name="Claim Status",
                    value="Under Review",
                    confidence=0.95
                ),
            ]

        elif document_type == "submission":
            return [
                ExtractedField(
                    field_name="Application ID",
                    value=f"APP-{random.randint(100000, 999999)}",
                    confidence=0.97
                ),
                ExtractedField(
                    field_name="Applicant Name",
                    value="John Smith",
                    confidence=0.96
                ),
                ExtractedField(
                    field_name="Application Date",
                    value="01/05/2024",
                    confidence=0.98
                ),
                ExtractedField(
                    field_name="Requested Coverage",
                    value="Full Coverage Auto",
                    confidence=0.91
                ),
                ExtractedField(
                    field_name="Vehicle Year",
                    value="2022",
                    confidence=0.95
                ),
                ExtractedField(
                    field_name="Vehicle Make/Model",
                    value="Toyota Camry",
                    confidence=0.94
                ),
            ]

        else:
            return [
                ExtractedField(
                    field_name="Document Type",
                    value="Unknown",
                    confidence=0.50
                ),
            ]
