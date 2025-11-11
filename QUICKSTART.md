# 🚀 Quick Start Guide - AI Hackathon PDF Generator

## ⚡ **Get Running in 3 Steps**

### **Step 1: One-Time Setup** (2 minutes)

```powershell
cd C:\Projects\AIHack\backend
setup.bat
```

This installs Python dependencies. **Do this once!**

---

### **Step 2: Start Servers** (10 seconds)

Double-click this file:
```
C:\Projects\AIHack\START_FRONTEND_FIRST.bat
```

This will:
1. ✅ Start Frontend (http://localhost:8080)
2. ✅ Start Backend (http://localhost:8000)
3. ✅ Open browser automatically

---

### **Step 3: Use the System**

Browser opens to http://localhost:8080

**You'll see 3 big buttons:**
1. 📝 **Design Template** - Create PDF templates
2. 📄 **Generate PDF** - Generate PDFs from JSON
3. 🧠 **Train ML Model** - Train AI on your templates

---

## 🎯 **Try It Now!**

### **Test 1: Create Template**

1. Click **"Design Template"**
2. Enter name: "Test Invoice"
3. Click "Text Field" button 3 times
4. Drag fields on canvas
5. Click "Save Template"

### **Test 2: Generate PDF**

1. Click **"Generate PDF"**
2. Select your template
3. Click **"Load Data from JSON File"**
4. Browse to: `C:\Projects\AIHack\data\sample-json\sample_invoice_data.json`
5. Click **"Generate PDF"**
6. PDF downloads! ✅

### **Test 3: Train ML Model**

1. Go to home page
2. Click **"Train ML Model"**
3. Click **"Start Training"**
4. Watch progress bar
5. Model trained! ✅

---

## 📁 **Project Structure**

```
AIHack/
├── frontend/           # HTML + JavaScript UI
├── backend/            # Python FastAPI server
├── ml-training/        # ML models storage
├── data/               # Sample JSON files
│   └── sample-json/    # Test data here!
└── START_*.bat         # Startup scripts
```

---

## 🌐 **Important URLs**

- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger UI)

---

## 💾 **Sample JSON Files Location**

```
C:\Projects\AIHack\data\sample-json\
├── sample_invoice_data.json   ← Use this for testing
└── sample_form_data.json       ← Or use this
```

---

## 🔧 **Manual Start (Alternative)**

### **Frontend:**
```powershell
cd C:\Projects\AIHack\frontend
python -m http.server 8080
```

### **Backend:**
```powershell
cd C:\Projects\AIHack\backend
venv\Scripts\activate
python app.py
```

---

## 🐛 **Troubleshooting**

### **Port Already in Use?**

Kill the process:
```powershell
# Find process on port 8080
netstat -ano | findstr :8080

# Kill it (use PID from above)
taskkill /PID <PID> /F
```

### **Backend Setup Failed?**

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### **Frontend Not Loading?**

Just double-click `frontend/index.html` - works without server too!

---

## ✅ **Quick Checklist**

- [ ] Run `backend/setup.bat` (one time)
- [ ] Double-click `START_FRONTEND_FIRST.bat`
- [ ] Browser opens to http://localhost:8080
- [ ] Create a template
- [ ] Generate PDF with sample JSON
- [ ] Train ML model

---

## 🎉 **That's It!**

You now have:
- ✅ Drag-and-drop template designer
- ✅ PDF generation from JSON files
- ✅ ML training capability
- ✅ Complete REST API
- ✅ Sample data ready to use

---

**Need more help?** Check `README.md` for full documentation!
