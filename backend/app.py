"""
PDF Template Generator - Python Backend
FastAPI server with ML training and PDF generation
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi import UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import json
import os
from datetime import datetime

# Import services
from services.pdf_service import PDFService
from services.ml_service import MLService
from services.pdf_parser import PDFParser

# Initialize FastAPI app
app = FastAPI(
    title="PDF Template Generator API",
    description="Generate PDFs from templates and train ML models",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_service = PDFService()
ml_service = MLService()
pdf_parser = PDFParser()

# ============================================================================
# Models
# ============================================================================

class Field(BaseModel):
    name: str
    type: str
    label: Optional[str] = None
    x: int
    y: int
    width: int
    height: int
    fontSize: Optional[int] = 12
    fontWeight: Optional[str] = "normal"
    fontFamily: Optional[str] = "Helvetica"
    # Table-specific properties
    tableRows: Optional[int] = None
    tableColumns: Optional[int] = None
    tableHeaders: Optional[List[str]] = None
    cellWidth: Optional[int] = None
    cellHeight: Optional[int] = None

class Template(BaseModel):
    name: str
    fields: List[Field]
    pageWidth: Optional[int] = 612
    pageHeight: Optional[int] = 792

class PDFRequest(BaseModel):
    template: Template
    data: Dict[str, str]

class TrainingConfig(BaseModel):
    epochs: int = 50
    batch_size: int = 16
    generate_synthetic: bool = True
    min_templates: int = 10

class TrainingRequest(BaseModel):
    templates: List[Template]
    config: Optional[TrainingConfig] = TrainingConfig()

# ============================================================================
# PDF Generation Endpoints
# ============================================================================

@app.post("/api/pdf/generate")
async def generate_pdf(request: PDFRequest):
    """
    Generate a PDF from template and data
    
    Request body:
    {
        "template": {
            "name": "Invoice",
            "fields": [...],
            "pageWidth": 612,
            "pageHeight": 792
        },
        "data": {
            "field_name": "value",
            ...
        }
    }
    
    Returns: PDF file as bytes
    """
    try:
        # Generate PDF
        pdf_bytes = pdf_service.generate_pdf(request.template, request.data)
        
        # Return as downloadable file
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={request.template.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ML Training Endpoints
# ============================================================================

@app.post("/api/train")
async def train_model(request: TrainingRequest, background_tasks: BackgroundTasks):
    """
    Train ML model on templates
    
    Request body:
    {
        "templates": [...],
        "config": {
            "epochs": 50,
            "batch_size": 16,
            "generate_synthetic": true,
            "min_templates": 10
        }
    }
    
    Returns: Training task ID for status polling (or immediate result)
    """
    try:
        # Convert Pydantic models to dicts
        templates_data = [t.dict() for t in request.templates]
        config = request.config.dict()
        
        # For synchronous training (small datasets)
        if len(templates_data) < 20:
            result = ml_service.train_model(templates_data, config)
            return {
                "status": "complete",
                "result": result
            }
        
        # For async training (large datasets)
        task_id = ml_service.create_training_task(templates_data, config)
        background_tasks.add_task(ml_service.train_async, task_id, templates_data, config)
        
        return {
            "status": "started",
            "task_id": task_id,
            "message": "Training started in background"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/train/status/{task_id}")
async def training_status(task_id: str):
    """
    Get training status
    """
    try:
        status = ml_service.get_training_status(task_id)
        
        if not status:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return status
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/info")
async def model_info():
    """
    Get current model information
    """
    try:
        info = ml_service.get_model_info()
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Template Generation from Model
# ============================================================================

@app.post("/api/generate-template")
async def generate_template_from_model(template_type: str = "invoice"):
    """
    Generate a new template using the trained ML model
    """
    try:
        template = ml_service.generate_template(template_type)
        return template
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Health Check
# ============================================================================

@app.get("/")
async def root():
    """
    Health check endpoint
    """
    return {
        "status": "running",
        "service": "PDF Template Generator API",
        "version": "1.0.0",
        "endpoints": {
            "pdf_generation": "/api/pdf/generate",
            "ml_training": "/api/train",
            "training_status": "/api/train/status/{task_id}",
            "model_info": "/api/model/info",
            "generate_template": "/api/generate-template",
            "docs": "/docs"
        }
    }

# ============================================================================
# PDF Import/Parse Endpoint
# ============================================================================

@app.post("/api/pdf/import")
async def import_pdf_template(file: UploadFile = File(...)):
    """
    Import an existing PDF form (created with Adobe Acrobat) and extract fields
    
    Returns: Template JSON compatible with the designer
    """
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Parse PDF form fields
        template = pdf_parser.parse_pdf_form(temp_path)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        # Check for errors
        if "error" in template:
            raise HTTPException(status_code=400, detail=template)
        
        return template
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """
    Detailed health check
    """
    return {
        "status": "healthy",
        "pdf_service": "ready",
        "ml_service": "ready",
        "model_loaded": ml_service.is_model_loaded(),
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 PDF Template Generator Backend")
    print("=" * 60)
    print("📄 PDF Generation: http://localhost:9000/api/pdf/generate")
    print("🧠 ML Training: http://localhost:9000/api/train")
    print("📚 API Docs: http://localhost:9000/docs")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=9000,
        log_level="info"
    )
