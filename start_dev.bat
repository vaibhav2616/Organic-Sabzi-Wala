@echo off
echo Starting Organic Sabzi Wala Development Environment...
echo ----------------------------------------------------

:: Start Backend (Django)
echo Starting Django Backend on Port 8000...
start "Organic Sabzi Backend" cmd /k "cd backend && python manage.py runserver"

:: Start Frontend (React/Vite)
echo Starting React Frontend on Port 5173...
start "Organic Sabzi Frontend" cmd /k "cd frontend && npm run dev"

echo ----------------------------------------------------
echo Servers launched in separate windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
