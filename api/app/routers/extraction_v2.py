from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

from app.models.extraction import ExtractionResponse
from app.services.ocr_extraction_service import OCRExtractionService

router = APIRouter()
ocr_service = OCRExtractionService()


@router.post("/extract", response_model=ExtractionResponse)
async def extract_document_ocr(file: UploadFile = File(...)):
    """
    Extract information from an uploaded insurance document using OCR.

    Uses Tesseract OCR to extract text from documents and parse
    insurance-related fields.

    Supported formats: PDF, PNG, JPG, JPEG
    Note: Word and Excel files are not fully supported in v2 OCR mode.
    """
    # Validate file type
    allowed_types = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type for OCR: {file.content_type}. "
                   f"Allowed types: PDF, PNG, JPG, JPEG. "
                   f"For Word/Excel files, use /api/v1/extract"
        )

    # Read file content
    content = await file.read()

    if len(content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded"
        )

    # Process extraction with OCR
    try:
        result = await ocr_service.extract(file.filename, content, file.content_type)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}"
        )
    print(result)
    return result


@router.post("/extract/batch", response_model=List[ExtractionResponse])
async def extract_documents_ocr(files: List[UploadFile] = File(...)):
    """
    Extract information from multiple uploaded insurance documents using OCR.
    """
    results = []
    errors = []

    for file in files:
        try:
            content = await file.read()
            result = await ocr_service._extract_text(file.filename, content, file.content_type)
            results.append(result)
        except Exception as e:
            errors.append(f"{file.filename}: {str(e)}")

    if errors and not results:
        raise HTTPException(
            status_code=500,
            detail=f"All files failed to process: {errors}"
        )

    return results
