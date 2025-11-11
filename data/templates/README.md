# PDF Template JSON Guide

## How to Create a Template JSON for Your Existing PDF

This guide helps you create a JSON file that maps your existing PDF form fields to work with the PDF Template Designer.

## 📋 Basic Template Structure

```json
{
  "name": "Your Template Name",
  "description": "Optional description",
  "fields": [
    {
      "name": "field_name",
      "type": "text",
      "label": "Field Label",
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

## 🎯 Field Properties

### Required Properties:
- **name**: Unique identifier for the field (use underscores, no spaces)
  - Example: `"first_name"`, `"invoice_number"`
  
- **type**: Field data type
  - Options: `"text"`, `"number"`, `"email"`, `"date"`, `"tel"`, `"textarea"`
  
- **label**: Display name shown in the form
  - Example: `"First Name"`, `"Invoice Number"`
  
- **x**: Horizontal position from left edge (in points)
  - 72 points = 1 inch
  - Letter page width = 612 points (8.5 inches)
  
- **y**: Vertical position from top edge (in points)
  - 72 points = 1 inch
  - Letter page height = 792 points (11 inches)
  
- **width**: Field width (in points)
  - Standard text field: 200 points
  
- **height**: Field height (in points)
  - Single line: 20-25 points
  - Multi-line: 60+ points

### Optional Properties:
- **fontSize**: Font size (default: 12)
- **fontWeight**: `"normal"` or `"bold"` (default: "normal")
- **fontFamily**: Font family (default: "Arial")

## 📐 Page Dimensions

Common page sizes:

| Page Type | Width | Height | Description |
|-----------|-------|--------|-------------|
| Letter (US) | 612 | 792 | 8.5" x 11" |
| A4 | 595 | 842 | 8.27" x 11.69" |
| Legal | 612 | 1008 | 8.5" x 14" |

## 📏 Measuring Field Positions

### Method 1: Using PDF Viewer
1. Open your PDF in Adobe Acrobat or similar
2. Enable rulers (View → Rulers & Grids → Show Rulers)
3. Note the position of each field in inches
4. Convert to points: **inches × 72 = points**

### Method 2: Using PDF Editor
1. Open PDF in an editor that shows coordinates
2. Click on each field to see its position
3. Note x, y, width, height values

### Method 3: Visual Designer (Recommended)
1. Open the PDF Template Designer in the application
2. Use the visual canvas to place fields
3. Export the template as JSON
4. Adjust positions as needed

## 🔢 Coordinate System

```
(0,0) ─────────────────────► X
  │
  │    [Your Field]
  │    x=100, y=150
  │    width=200, height=20
  │
  ▼
  Y

Letter Page: 612 x 792 points
```

## 💡 Tips for Creating Templates

1. **Start with a grid layout**
   - Left margin: x = 50
   - Top margin: y = 100
   - Spacing between fields: 40 points

2. **Standard field dimensions**
   - Short text (name, email): width = 200-250
   - Long text (address): width = 300-400
   - Single line height: 20-25
   - Multi-line height: 60-100

3. **Field naming conventions**
   - Use lowercase with underscores: `first_name`, `company_address`
   - Be descriptive: `invoice_date` not `date1`
   - Group related fields: `billing_address`, `billing_city`

4. **Test your template**
   - Import the JSON into the designer
   - Generate a test PDF
   - Adjust positions as needed

## 📂 Example Templates

See the `data/templates/` folder for:
- `employee_form_template.json` - Employee registration form
- `invoice_template.json` - Professional invoice template

## 🚀 How to Use Your Template

### Option 1: Import into Designer
1. Go to the Template Designer page
2. Click "Import Template"
3. Select your JSON file
4. Visual editor will load your template
5. Make adjustments if needed
6. Save to browser storage

### Option 2: Direct JSON Import
1. Copy your JSON content
2. Open browser console (F12)
3. Run:
```javascript
TemplateStorage.import('[your JSON array]', true)
```

### Option 3: Manual Copy
1. Open Designer
2. Manually place fields at positions from your PDF
3. Use the coordinates from your JSON as reference
4. Save the template

## 🛠️ Conversion Helper

To convert your existing PDF measurements:

| Measurement | Formula | Example |
|-------------|---------|---------|
| Inches to Points | inches × 72 | 2.5" = 180 pts |
| Centimeters to Points | cm × 28.35 | 5 cm = 141.75 pts |
| Millimeters to Points | mm × 2.835 | 50 mm = 141.75 pts |

## ❓ Common Issues

**Fields appear in wrong position**
- Check if your PDF uses a different coordinate system
- Try adjusting y-coordinates (some PDFs measure from bottom)

**Text is cut off**
- Increase width or height values
- Check fontSize isn't too large for the field

**Template won't load**
- Validate JSON syntax at jsonlint.com
- Ensure all required fields are present
- Check for trailing commas in arrays

## 📞 Need Help?

1. Check existing templates in `data/templates/`
2. Use the visual Designer tool for easier creation
3. Export from Designer to see JSON structure

---

Happy Template Creating! 🎉
