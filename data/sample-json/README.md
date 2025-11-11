# Sample JSON Data Files

This folder contains sample JSON files for testing PDF generation.

## 📁 Contents

- `sample_invoice_data.json` - Invoice example
- `sample_form_data.json` - Form/application example

## 📊 **How to Use**

### **Method 1: Via UI (Recommended)**

1. Open http://localhost:8080
2. Click **"Generate PDF"**
3. Select a template
4. Click **"Load Data from JSON File"**
5. Browse to this folder
6. Select `sample_invoice_data.json` or `sample_form_data.json`
7. Click **"Generate PDF"**

### **Method 2: Via API**

```bash
curl -X POST "http://localhost:8000/api/pdf/generate" \
  -H "Content-Type: application/json" \
  -d @sample_invoice_data.json
```

## 📝 **JSON Format**

JSON files must have keys matching your template field names:

```json
{
  "field_name_1": "value 1",
  "field_name_2": "value 2",
  "checkbox_field": "Yes"
}
```

### **Field Type Values:**

| Field Type | Value Examples |
|------------|----------------|
| Text | `"John Doe"` |
| Number | `"1234"` or `"99.99"` |
| Date | `"2025-11-06"` |
| Checkbox | `"Yes"`, `"No"`, `"true"`, `"false"` |

## 📄 **Sample Files Explained**

### **sample_invoice_data.json**

Use this with an invoice template containing fields like:
- customer_name
- invoice_number
- invoice_date
- total_amount
- etc.

### **sample_form_data.json**

Use this with a form template containing fields like:
- first_name
- last_name
- email
- phone
- etc.

## 🎯 **Create Your Own JSON**

### **Step 1: Design Template**
1. Go to Designer
2. Create fields with specific names (e.g., "customer_name")
3. Save template

### **Step 2: Create JSON**
Create a file like this:
```json
{
  "customer_name": "Jane Doe",
  "invoice_number": "INV-2025-100",
  "date": "2025-11-06"
}
```

### **Step 3: Generate PDF**
1. Select your template
2. Upload your JSON
3. Generate!

## 📋 **Tips**

- **Field names must match exactly** (case-sensitive)
- Use valid JSON format (check with https://jsonlint.com)
- String values for all types (numbers too)
- Checkboxes: Use "Yes"/"No" or "true"/"false"

## 🔧 **Export Current Form Data**

When filling a form manually, you can export the data:
1. Fill in form fields
2. Click **"Export JSON"** button
3. Save JSON for reuse later

---

**Location:** `C:\Projects\AIHack\data\sample-json\`
