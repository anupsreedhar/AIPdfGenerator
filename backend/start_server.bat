@echo off
echo ========================================
echo Starting PDF Template Generator Backend
echo ========================================
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

echo Starting server at http://localhost:9000
echo API Docs: http://localhost:9000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py
