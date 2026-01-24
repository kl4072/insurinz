from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, extraction, extraction_v2

app = FastAPI(
    title="Insurinz API",
    description="Document extraction API for insurance documents",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(extraction.router, prefix="/api/v1", tags=["Extraction v1 (Mock)"])
app.include_router(extraction_v2.router, prefix="/api/v2", tags=["Extraction v2 (OCR)"])


@app.get("/")
async def root():
    return {
        "message": "Insurinz API",
        "version": "2.0.0",
        "endpoints": {
            "v1": "/api/v1/extract - Mock extraction (for testing)",
            "v2": "/api/v2/extract - OCR extraction (pytesseract)"
        }
    }
