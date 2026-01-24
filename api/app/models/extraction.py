from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime


class ExtractedField(BaseModel):
    field_name: str
    value: str
    confidence: float


class ExtractionResponse(BaseModel):
    filename: str
    document_type: Literal["policy", "claim", "submission", "unknown"]
    confidence: float
    extracted_fields: List[ExtractedField]
    processed_at: datetime
