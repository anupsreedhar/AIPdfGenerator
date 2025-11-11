@echo off
echo ==========================================
echo AI Hackathon - PDF Template Generator
echo Starting All Servers
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

REM Start Backend first
echo [1/2] Starting Backend Server...
start "AIHack Backend" cmd /k "cd backend && venv\Scripts\activate && echo Backend Server Running && echo URL: http://localhost:9000 && echo. && python app.py"

echo ✅ Backend starting on http://localhost:9000
echo.

REM Wait 3 seconds for backend
timeout /t 3 /nobreak > nul

REM Start Frontend
echo [2/2] Starting Frontend Server...
start "AIHack Frontend" cmd /k "cd frontend && echo Frontend Server Running && echo URL: http://localhost:9080 && echo. && python -m http.server 9080"

echo ✅ Frontend starting on http://localhost:9080
echo.

echo ==========================================
echo Both Servers Starting! ✅
echo ==========================================
echo.
echo Backend:  http://localhost:9000
echo Frontend: http://localhost:9080
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
echo Two terminal windows opened:
echo - AIHack Backend (Python server)
echo - AIHack Frontend (HTTP server)
echo.
echo Close those windows to stop the servers.
echo.
pause
