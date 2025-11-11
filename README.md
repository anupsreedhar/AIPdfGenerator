# 🎯 AI Hackathon - PDF Template Generator with ML

**Professional project structure for PDF template generation with ML training**

---

## 📁 **Project Structure**

```
AIHack/
│
├── frontend/                    # HTML + JavaScript UI
│   ├── index.html              # Home page & template library
│   ├── designer.html           # Drag-and-drop template designer
│   ├── generate.html           # PDF generation with JSON upload
│   ├── train.html              # ML training interface
│   ├── css/
│   │   └── style.css          # Custom styles
│   └── js/
│       ├── storage.js         # localStorage helper
│       ├── index.js           # Home page logic
│       ├── designer.js        # Fabric.js canvas designer
│       ├── generate.js        # PDF generation + JSON upload
│       └── train.js           # ML training interface
│
├── backend/                     # Python FastAPI backend
│   ├── app.py                  # Main FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── setup.bat              # One-time setup script
│   ├── start_server.bat       # Start backend server
│   └── services/
│       ├── __init__.py
│       ├── pdf_service.py     # ReportLab PDF generation
│       └── ml_service.py      # TensorFlow ML training
│
├── ml-training/                 # ML training scripts & models
│   ├── README.md               # ML training documentation
│   └── trained-models/         # Saved ML models (auto-created)
│       ├── template_model.keras
│       └── model_info.json
│
├── data/                        # Data storage
│   ├── sample-json/            # Sample JSON data files
│   │   ├── sample_invoice_data.json
│   │   └── sample_form_data.json
│   └── templates/              # Template storage (optional)
│
├── START_ALL.bat               # Start both servers
├── START_FRONTEND_FIRST.bat   # Start frontend → backend
├── QUICKSTART.md               # Quick start guide
└── README.md                   # This file
```

---

## 🚀 **Quick Start**

### **1. One-Click Startup (Easiest)** ✅

Just double-click:
```
START_FRONTEND_FIRST.bat
```

This will:
- ✅ Start frontend server (port 8080)
- ✅ Start backend server (port 8000)
- ✅ Open browser automatically

### **2. First Time Setup**

Before first run, setup backend dependencies:

```powershell
cd backend
setup.bat
```

This installs Python packages (one-time only).

---

## 🎯 **Features**

### **Frontend**
- 📝 Drag-and-drop template designer
- 📄 PDF generator with JSON file upload
- 🧠 ML training interface with progress tracking
- 💾 localStorage for templates (no database!)
- 🎨 Bootstrap 5 responsive UI

### **Backend**
- 📑 PDF generation using ReportLab
- 🤖 ML training using TensorFlow/Keras
- 🔄 RESTful API with Swagger docs
- 📊 Synthetic template generation
- 💾 Model persistence

---

## 📊 **Workflow**

### **1. Create Template**
- Open Designer
- Add fields (Text, Number, Date, Checkbox, Label)
- Drag and resize on canvas
- Save template

### **2. Train ML Model** (Optional)
- Create 3+ templates
- Go to Train Model page
- Configure settings
- Start training
- Model learns template patterns

### **3. Generate PDF**
- Select template
- **Upload JSON file** with data
- Generate PDF
- Download!

---

## 🔌 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pdf/generate` | Generate PDF from template + data |
| POST | `/api/train` | Train ML model on templates |
| GET | `/api/train/status/{id}` | Get training progress |
| GET | `/api/model/info` | Get model metadata |
| GET | `/docs` | Swagger API documentation |

---

## 📦 **Sample Data**

Sample JSON files included in `data/sample-json/`:

**invoice_data.json**
```json
{
  "customer_name": "John Doe",
  "invoice_number": "INV-2025-001",
  "total_amount": "1650.00"
}
```

**form_data.json**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com"
}
```

---

## 💾 **Storage Strategy**

### **Frontend (localStorage)**
- Stores ALL templates in browser
- 5-10 MB capacity (100+ templates)
- Export/import as JSON
- No backend storage needed

### **Backend**
- Only stores trained ML model
- Stateless architecture
- Templates sent with each request

### **ML Models**
- Saved in `ml-training/trained-models/`
- `.keras` format for TensorFlow
- Metadata in JSON

---

## 🛠️ **Technology Stack**

### **Frontend**
- HTML5 + JavaScript (Vanilla)
- Bootstrap 5.3.2 (UI framework)
- Fabric.js 5.3.0 (Canvas library)
- Axios (HTTP client)
- Font Awesome 6.4.2 (Icons)

### **Backend**
- Python 3.11+
- FastAPI 0.104.1 (Web framework)
- Uvicorn 0.24.0 (ASGI server)
- ReportLab 4.0.7 (PDF generation)
- TensorFlow 2.15.0 (ML training)
- NumPy 1.26.2 (Numerical computing)

---

## 📝 **Manual Startup**

### **Frontend Server**
```powershell
cd frontend
python -m http.server 8080
```

### **Backend Server**
```powershell
cd backend
venv\Scripts\activate
python app.py
```

---

## 🌐 **URLs**

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 🎓 **Use Cases**

1. **Invoice Generation** - Design invoice template → Upload customer data JSON → Generate PDFs
2. **Form Filling** - Create form template → Load applicant data → Generate completed forms
3. **Certificate Generation** - Template certificate → Upload participant list → Batch generate
4. **Report Generation** - Template report layout → Supply data via JSON → Generate reports

---

## 🔧 **Configuration**

### **Change Backend URL**
Frontend → Generate PDF page → Click ⚙️ settings → Update URL

### **Change Ports**
- Frontend: Edit `START_*.bat` files (change 8080)
- Backend: Edit `app.py` (change port=8000)

---

## 🐛 **Troubleshooting**

### **Backend won't start**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### **Frontend won't start**
```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Use different port
python -m http.server 8081
```

### **CORS errors**
Backend allows all origins by default. Check browser console.

### **Training fails**
- Need at least 1 template (system generates more)
- Check backend logs for errors
- Reduce epochs if slow

---

## 📚 **Documentation**

- `README.md` - This file (overview)
- `QUICKSTART.md` - Quick start guide
- `backend/README.md` - Backend API details
- `frontend/README.md` - Frontend usage guide
- `ml-training/README.md` - ML training details

---

## 🎉 **Key Features**

✅ No database required (localStorage)  
✅ JSON file upload for data  
✅ ML model training  
✅ Drag-and-drop designer  
✅ Python backend (natural ML integration)  
✅ Auto-generated API docs  
✅ Sample data included  
✅ Export/import templates  
✅ Responsive UI  
✅ Progress tracking  

---

## 🏆 **Built for AI Hackathon 2025**

**Tech Stack:** HTML + JavaScript + Python + FastAPI + TensorFlow + ReportLab

**License:** MIT

---

## 🤝 **Contributing**

Feel free to enhance:
- Add more field types
- Improve ML model architecture
- Add authentication
- Add database support
- Enhance PDF styling
- Add more templates

---

**Questions?** Check the documentation in each folder or the API docs at http://localhost:8000/docs
