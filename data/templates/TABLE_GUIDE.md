# Table Support in PDF Template Designer

## 📊 Overview

The PDF Template Designer now supports **dynamic tables** with configurable rows, columns, and headers. Tables can be added to your PDF templates to display structured data like invoices, order lists, attendance sheets, and more.

## ✨ Features

- ✅ **Visual Table Builder** - Add tables with a simple modal interface
- ✅ **Configurable Rows & Columns** - Set any number of rows (1-20) and columns (1-10)
- ✅ **Custom Headers** - Add column headers with custom labels
- ✅ **Adjustable Cell Size** - Control cell width and height
- ✅ **Drag & Position** - Move tables anywhere on the canvas
- ✅ **PDF Generation** - Tables render beautifully in generated PDFs
- ✅ **Data Binding** - Fill tables with data from JSON or forms

## 🎯 How to Add a Table

### Step 1: Open Designer
Navigate to: http://localhost:9080/designer.html

### Step 2: Click "Table" Button
Click the **"Table"** button in the left sidebar (under "Add Fields")

### Step 3: Configure Table
A modal will appear with these options:

| Option | Description | Example |
|--------|-------------|---------|
| **Table Name** | Unique identifier | `invoice_items`, `attendance_list` |
| **Number of Rows** | Data rows (1-20) | `5` |
| **Number of Columns** | Table columns (1-10) | `3` |
| **Column Headers** | Comma-separated headers | `Name, Email, Phone` |
| **Cell Width** | Width of each cell in points | `100` |
| **Cell Height** | Height of each cell in points | `25` |

### Step 4: Add Table
Click **"Add Table"** button - the table will appear on the canvas

### Step 5: Position & Save
- Drag the table to desired position
- Resize if needed
- Click "Save Template" or "Export JSON"

## 📋 Example Configurations

### Example 1: Invoice Items Table
```
Table Name: invoice_items
Rows: 5
Columns: 4
Headers: Description, Quantity, Price, Total
Cell Width: 120
Cell Height: 25
```

### Example 2: Employee Attendance
```
Table Name: attendance
Rows: 10
Columns: 5
Headers: Date, Name, Time In, Time Out, Status
Cell Width: 100
Cell Height: 20
```

### Example 3: Order Summary
```
Table Name: order_details
Rows: 8
Columns: 3
Headers: Item, Quantity, Amount
Cell Width: 150
Cell Height: 30
```

## 📄 JSON Structure

When you export a template with a table, it looks like this:

```json
{
  "name": "Invoice Template",
  "fields": [
    {
      "name": "invoice_items",
      "type": "table",
      "label": "INVOICE ITEMS",
      "x": 50,
      "y": 200,
      "width": 400,
      "height": 150,
      "tableRows": 5,
      "tableColumns": 4,
      "tableHeaders": ["Description", "Quantity", "Price", "Total"],
      "cellWidth": 100,
      "cellHeight": 30
    }
  ]
}
```

## 🔧 Filling Table Data

### Method 1: Array of Arrays

```json
{
  "invoice_items": [
    ["Item 1", "2", "$10", "$20"],
    ["Item 2", "1", "$15", "$15"],
    ["Item 3", "3", "$5", "$15"]
  ]
}
```

### Method 2: Array of Objects (with headers)

```json
{
  "invoice_items": [
    {"Description": "Item 1", "Quantity": "2", "Price": "$10", "Total": "$20"},
    {"Description": "Item 2", "Quantity": "1", "Price": "$15", "Total": "$15"},
    {"Description": "Item 3", "Quantity": "3", "Price": "$5", "Total": "$15"}
  ]
}
```

## 🎨 Visual Appearance

### In Designer:
- Tables appear as a grid with borders
- Headers are shown in bold if specified
- Movable and resizable as a group
- Clear visual structure

### In Generated PDF:
- Professional table layout with borders
- Bold headers with light blue background
- Data rows with proper alignment
- Auto-truncation for long text

## 💡 Best Practices

### 1. **Naming Convention**
- Use descriptive names: `product_list`, `employee_roster`
- Use underscores, not spaces: `invoice_items` not `invoice items`

### 2. **Size Considerations**
- **Page Width**: Letter page = 612 points
  - Leave margins (50 points left/right)
  - Max table width ≈ 512 points
- **Cell Width**: 
  - 3 columns: ~170 points each
  - 4 columns: ~125 points each
  - 5 columns: ~100 points each

### 3. **Row Planning**
- Include enough rows for your data
- Extra empty rows are fine
- Data will fill top-down

### 4. **Header Strategy**
- Always use headers for clarity
- Keep headers concise
- Use title case: "First Name" not "FIRST NAME"

## 📊 Common Use Cases

### 1. Invoice/Receipt
```
Columns: Description, Qty, Unit Price, Total
Rows: 10-15
Cell Size: 120x25
```

### 2. Attendance Sheet
```
Columns: Date, Name, Sign In, Sign Out, Hours
Rows: 20-30
Cell Size: 100x20
```

### 3. Order Form
```
Columns: Product, Quantity, Price
Rows: 8-12
Cell Size: 150x30
```

### 4. Contact List
```
Columns: Name, Phone, Email, Address
Rows: 15-20
Cell Size: 120x25
```

### 5. Schedule/Timetable
```
Columns: Time, Monday, Tuesday, Wednesday, Thursday, Friday
Rows: 8-10
Cell Size: 80x30
```

## 🔄 Editing Tables

### To Edit an Existing Table:
1. **Delete & Recreate**: Currently, tables must be deleted and recreated to change structure
2. **Move**: Click and drag to reposition
3. **Resize**: Use corner handles (resizes entire table proportionally)

### Future Enhancements (Coming Soon):
- In-place table editing
- Add/remove rows dynamically
- Column width adjustment
- Cell styling options

## 🐛 Troubleshooting

### Table too wide for page
- **Solution**: Reduce cell width or number of columns
- **Formula**: `tableWidth = cellWidth × columns`
- **Max recommended**: 512 points for letter page

### Headers not showing
- **Cause**: Headers field left empty
- **Solution**: Enter comma-separated header text

### Data not filling correctly
- **Cause**: Data format mismatch
- **Solution**: Use array of arrays or array of objects (see examples above)

### Table appears cut off in PDF
- **Cause**: Y position + table height exceeds page height
- **Solution**: Position table higher on page or reduce rows

## 📐 Size Calculator

### Letter Page (612 × 792 points)

**Safe Table Area:**
- X: 50 to 562 (512 points width)
- Y: 100 to 692 (592 points height)

**Column Width Guide:**
```
2 columns: 250 points each
3 columns: 170 points each
4 columns: 125 points each
5 columns: 100 points each
6 columns: 85 points each
```

**Row Count by Cell Height:**
```
Cell Height 20px: ~29 rows max
Cell Height 25px: ~23 rows max
Cell Height 30px: ~19 rows max
```

## 🎯 Example: Complete Invoice Template

```json
{
  "name": "Professional Invoice",
  "fields": [
    {
      "name": "invoice_number",
      "type": "text",
      "label": "Invoice #",
      "x": 400,
      "y": 80,
      "width": 150,
      "height": 20
    },
    {
      "name": "client_name",
      "type": "text",
      "label": "Bill To",
      "x": 50,
      "y": 150,
      "width": 250,
      "height": 20
    },
    {
      "name": "invoice_items",
      "type": "table",
      "label": "LINE ITEMS",
      "x": 50,
      "y": 250,
      "width": 512,
      "height": 180,
      "tableRows": 6,
      "tableColumns": 4,
      "tableHeaders": ["Description", "Qty", "Price", "Amount"],
      "cellWidth": 128,
      "cellHeight": 30
    },
    {
      "name": "total",
      "type": "number",
      "label": "Total Amount",
      "x": 450,
      "y": 450,
      "width": 100,
      "height": 25
    }
  ]
}
```

## 🚀 Try It Now!

1. Open Designer: http://localhost:9080/designer.html
2. Click "Table" button
3. Configure your table
4. Position it on canvas
5. Save or export
6. Generate PDF with data!

---

**Tables make your PDFs professional and data-rich!** 📊✨
