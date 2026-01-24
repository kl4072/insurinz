from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

from app.models.extraction import ExtractionResponse, ExtractedField
from app.services.extraction_service import ExtractionService

router = APIRouter()
extraction_service = ExtractionService()


@router.post("/extract", response_model=ExtractionResponse)
async def extract_document(file: UploadFile = File(...)):
    """
    Extract information from an uploaded insurance document.

    Supported formats: PDF, PNG, JPG, JPEG, DOC, DOCX, XLS, XLSX
    """
    # Validate file type
    allowed_types = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed types: PDF, images, Word, Excel"
        )

    # Read file content
    content = await file.read()

    # Process extraction
    result = await extraction_service.extract(file.filename, content, file.content_type)

    return result


@router.post("/extract/batch", response_model=List[ExtractionResponse])
async def extract_documents(files: List[UploadFile] = File(...)):
    """
    Extract information from multiple uploaded insurance documents.
    """
    results = []

    for file in files:
        content = await file.read()
        result = await extraction_service.extract(file.filename, content, file.content_type)
        results.append(result)

    return results
