@echo off
echo ========================================
echo Starting PDF Template Generator Backend
echo ========================================
echo.

REM Check if virtual environment exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Using system Python...
)

echo Starting server at http://localhost:9000
echo API Docs: http://localhost:9000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py
