"""
PDF to HTML Converter
Converts PDF templates to lightweight HTML/CSS templates
"""

import os
from datetime import datetime
import json


class PDFToHTMLConverter:
    """Convert PDF templates to HTML/CSS for efficient storage and rendering"""
    
    def __init__(self):
        """Initialize the PDF to HTML converter"""
        self.output_dir = "data/templates"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def convert_pdf_to_html(self, pdf_path: str, template_name: str, field_positions: dict) -> str:
        """
        Convert a PDF template with detected fields to an HTML template
        
        Args:
            pdf_path: Path to the PDF file
            template_name: Name for the template
            field_positions: Dictionary containing detected fields and their positions
        
        Returns:
            Path to the generated HTML file
        """
        print(f"🔄 Converting {template_name} to HTML...")
        
        # Get page dimensions from field_positions or use defaults
        page_width = field_positions.get('pageWidth', 612)
        page_height = field_positions.get('pageHeight', 792)
        fields = field_positions.get('fields', [])
        
        # Generate HTML content
        html_content = self._generate_html_template(
            template_name=template_name,
            page_width=page_width,
            page_height=page_height,
            fields=fields
        )
        
        # Save HTML file
        html_filename = f"{template_name}.html"
        html_path = os.path.join(self.output_dir, html_filename)
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ HTML template created: {html_path}")
        print(f"📊 HTML size: {len(html_content)} bytes ({len(html_content)/1024:.1f} KB)")
        
        return html_path
    
    def _generate_html_template(self, template_name: str, page_width: int, page_height: int, fields: list) -> str:
        """
        Generate HTML template with positioned fields
        
        Args:
            template_name: Name of the template
            page_width: Width of the page in points
            page_height: Height of the page in points
            fields: List of field dictionaries with positions
        
        Returns:
            HTML content as string
        """
        # Convert points to pixels (1 point = 1.333 pixels for web)
        width_px = int(page_width * 1.333)
        height_px = int(page_height * 1.333)
        
        # Build field HTML
        fields_html = ""
        for field in fields:
            field_name = field.get('name', 'field')
            field_label = field.get('label', field_name)
            field_type = field.get('type', 'text')
            x = int(field.get('x', 0) * 1.333)
            y = int(field.get('y', 0) * 1.333)
            width = int(field.get('width', 100) * 1.333)
            height = int(field.get('height', 20) * 1.333)
            font_size = field.get('fontSize', 12)
            
            # Create field HTML based on type
            if field_type == 'checkbox':
                field_html = f'''
    <div class="field checkbox-field" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;">
        <input type="checkbox" id="{field_name}" data-field="{field_name}">
        <label for="{field_name}">{field_label}</label>
    </div>'''
            elif field_type == 'table':
                field_html = f'''
    <div class="field table-field" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;">
        <table id="{field_name}" data-field="{field_name}" class="data-table">
            <thead><tr><th>Header</th></tr></thead>
            <tbody><tr><td>{{{{data}}}}</td></tr></tbody>
        </table>
    </div>'''
            else:
                field_html = f'''
    <div class="field text-field" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;">
        <span data-field="{field_name}" style="font-size: {font_size}px;">{{{{{{field_name}}}}}}</span>
    </div>'''
            
            fields_html += field_html
        
        # Generate complete HTML
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{template_name}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: Arial, Helvetica, sans-serif;
            background: #f0f0f0;
            padding: 20px;
        }}
        
        .page {{
            position: relative;
            width: {width_px}px;
            height: {height_px}px;
            background: white;
            margin: 0 auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .field {{
            position: absolute;
            font-family: Arial, Helvetica, sans-serif;
        }}
        
        .text-field span {{
            display: block;
            width: 100%;
            height: 100%;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
        }}
        
        .checkbox-field {{
            display: flex;
            align-items: center;
            gap: 5px;
        }}
        
        .table-field table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }}
        
        .table-field th,
        .table-field td {{
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }}
        
        .table-field th {{
            background: #f5f5f5;
            font-weight: bold;
        }}
        
        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            
            .page {{
                box-shadow: none;
                margin: 0;
            }}
        }}
    </style>
</head>
<body>
    <div class="page">
{fields_html}
    </div>
</body>
</html>'''
        
        return html
    
    def fill_template(self, html_path: str, data: dict) -> str:
        """
        Fill an HTML template with data
        
        Args:
            html_path: Path to the HTML template
            data: Dictionary of field values
        
        Returns:
            Filled HTML content
        """
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Replace placeholders with actual data
        for field_name, value in data.items():
            placeholder = f"{{{{{{{field_name}}}}}}}"
            html_content = html_content.replace(placeholder, str(value))
        
        return html_content
