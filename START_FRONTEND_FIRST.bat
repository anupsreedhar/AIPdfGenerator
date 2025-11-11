@echo off
echo ==========================================
echo AI Hackathon - PDF Template Generator
echo Starting Frontend → Backend
echo ==========================================
echo.

REM Check if backend is set up
if not exist "backend\venv\" (
    echo ⚠️  Backend not set up yet!
    echo.
    echo Running setup first...
    cd backend
    call setup.bat
    cd ..
    echo.
)

echo [1/2] Starting Frontend Server...
start "AIHack Frontend" cmd /k "cd frontend && echo Frontend Server Running && echo URL: http://localhost:9080 && echo. && python -m http.server 9080"

echo ✅ Frontend starting on http://localhost:9080
echo.

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

echo [2/2] Starting Backend Server...
start "AIHack Backend" cmd /k "cd backend && venv\Scripts\activate && echo Backend Server Running && echo URL: http://localhost:9000 && echo API Docs: http://localhost:9000/docs && echo. && python app.py"

echo ✅ Backend starting on http://localhost:9000
echo.

echo ==========================================
echo Startup Order: Frontend → Backend ✅
echo ==========================================
echo.
echo Frontend: http://localhost:9080
echo Backend:  http://localhost:9000
echo API Docs: http://localhost:9000/docs
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:9080

echo.
echo ==========================================
echo 🎉 AI Hackathon System Ready!
echo ==========================================
echo.
echo To stop:
echo - Close the Frontend window
echo - Close the Backend window
echo - Or press Ctrl+C in each window
echo.
pause
