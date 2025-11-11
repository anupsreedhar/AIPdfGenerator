@echo off
echo ========================================
echo PDF Template Generator - Backend Setup
echo ========================================
echo.

REM Check if venv exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Installing dependencies...
pip install -r requirements.txt
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the server, run:
echo   start_server.bat
echo.
pause
