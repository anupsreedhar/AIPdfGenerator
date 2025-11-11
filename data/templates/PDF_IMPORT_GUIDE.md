# Import PDF Template Feature - User Guide

## 📄 Overview

This feature allows you to **import existing PDF forms** (created with Adobe Acrobat or other PDF editors) and automatically extract the form fields to create a compatible JSON template for the PDF Template Designer.

## ✨ What It Does

The PDF Import feature:
- ✅ Reads PDF form fields from your existing PDF
- ✅ Extracts field names, positions, sizes, and types
- ✅ Converts coordinates to designer-compatible format
- ✅ Creates editable template in the visual designer
- ✅ Generates JSON that can be exported and reused

## 🎯 How to Use

### Method 1: Using the Designer Interface (Recommended)

1. **Open the Template Designer**
   - Navigate to: http://localhost:9080/designer.html

2. **Click "Import PDF" Button**
   - Located in the left sidebar (red button)
   - This will open a file picker dialog

3. **Select Your PDF File**
   - Choose a PDF that has fillable form fields
   - Must be created with Adobe Acrobat or similar tool

4. **Wait for Processing**
   - The system will upload and parse your PDF
   - Progress notification will appear

5. **Review Imported Fields**
   - Fields will appear on the canvas
   - Check positions and adjust if needed
   - Edit field properties in the right panel

6. **Save or Export**
   - Click "Save Template" to store in browser
   - Click "Export JSON" to download JSON file

### Method 2: Using API Directly

```javascript
// Upload PDF file
const formData = new FormData();
formData.append('file', pdfFile);

const response = await axios.post('http://localhost:9000/api/pdf/import', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

const template = response.data;
console.log(template);
```

## 📋 Requirements for PDF Files

### ✅ Supported PDF Types:
- PDFs with fillable form fields (created with Adobe Acrobat)
- Interactive PDF forms
- PDFs with text field annotations
- Forms with field properties defined

### ❌ Not Supported:
- Static PDFs without form fields (just images/text)
- Scanned documents
- PDFs with only image-based forms
- Encrypted/password-protected PDFs

## 🔍 What Gets Extracted

For each form field in your PDF, the system extracts:

| Property | Description | Example |
|----------|-------------|---------|
| **name** | Field identifier | `first_name`, `email` |
| **type** | Field type | `text`, `number`, `checkbox` |
| **label** | Display label | `First Name` |
| **x** | Horizontal position | `100` |
| **y** | Vertical position | `150` |
| **width** | Field width | `200` |
| **height** | Field height | `20` |
| **fontSize** | Font size | `12` |
| **fontWeight** | Font weight | `normal` or `bold` |
| **fontFamily** | Font family | `Arial` |

## ⚙️ How It Works

```
┌─────────────────┐
│  Upload PDF     │
│  with forms     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  /api/pdf/import│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PyPDF2 Parser  │
│  Extract fields │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Convert to     │
│  Template JSON  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load in        │
│  Designer       │
└─────────────────┘
```

## 🛠️ Technical Details

### Coordinate Conversion

PDF coordinates use **bottom-left** origin, while the designer uses **top-left** origin. The system automatically converts:

```
PDF Coordinate: (x, y_bottom)
Designer Coordinate: (x, pageHeight - y_top)
```

### Field Type Mapping

| PDF Field Type | Designer Type |
|----------------|---------------|
| /Tx (Text) | `text` |
| /Ch (Choice) | `select` |
| /Btn (Button) | `checkbox` |

## 📝 Example Workflow

### Creating a Form with Adobe Acrobat

1. **Open Adobe Acrobat**
2. **Go to Tools → Prepare Form**
3. **Add form fields** (text fields, checkboxes, etc.)
4. **Name each field** appropriately
5. **Set field properties** (size, font, etc.)
6. **Save the PDF**

### Importing into Template Designer

1. **Open Designer** (http://localhost:9080/designer.html)
2. **Click "Import PDF"**
3. **Select your PDF file**
4. **Fields load automatically**
5. **Adjust positions** if needed
6. **Save template**

## 🎨 After Import - What You Can Do

### Editing Fields
- Click any field to select it
- Use Properties panel to edit:
  - Field name and label
  - Field type
  - Position and size
  - Font settings

### Adding More Fields
- Use "Add Field" buttons
- Drag and drop on canvas
- Position manually

### Exporting
- **Save Template**: Stores in browser LocalStorage
- **Export JSON**: Downloads JSON file
- **Preview JSON**: View the template structure

## ❓ Troubleshooting

### "No form fields found in PDF"
**Cause**: PDF doesn't contain fillable form fields
**Solution**: 
- Recreate PDF with Adobe Acrobat Form Tools
- Add form fields to existing PDF
- Use "Prepare Form" feature in Acrobat

### "Cannot connect to backend server"
**Cause**: Backend is not running
**Solution**:
- Run `START_FRONTEND_FIRST.bat` or `START_ALL.bat`
- Ensure backend is on port 9000
- Check backend terminal for errors

### Fields appear in wrong positions
**Cause**: Coordinate system differences
**Solution**:
- Manually adjust field positions in designer
- Use visual editor to reposition
- Save adjusted template

### Some fields are missing
**Cause**: PDF uses non-standard field annotations
**Solution**:
- Check if fields have names in source PDF
- Try recreating PDF with standard form fields
- Manually add missing fields in designer

## 🔐 Security Notes

- PDF files are processed server-side
- Temporary files are deleted after processing
- No PDF data is permanently stored
- Only form field metadata is extracted

## 📚 Related Documentation

- [Template JSON Guide](./templates/README.md)
- [Designer Manual](./designer_guide.md)
- [API Documentation](http://localhost:9000/docs)

## 💡 Tips

1. **Name fields clearly** in Adobe Acrobat before importing
2. **Use consistent naming** (e.g., `first_name`, `last_name`)
3. **Test with simple forms first** before complex ones
4. **Export JSON backup** after successful import
5. **Adjust positions visually** - don't rely solely on auto-extraction

## 🎉 Success Example

```json
{
  "name": "Imported PDF Template",
  "description": "Imported from PDF with 8 fields",
  "fields": [
    {
      "name": "first_name",
      "type": "text",
      "label": "First Name",
      "x": 100,
      "y": 150,
      "width": 200,
      "height": 20,
      "fontSize": 12,
      "fontWeight": "normal",
      "fontFamily": "Arial"
    }
  ],
  "pageWidth": 612,
  "pageHeight": 792
}
```

---

**Need Help?** Check the API docs at http://localhost:9000/docs or review the console for detailed error messages.
