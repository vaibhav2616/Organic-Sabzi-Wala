@echo off
echo ===================================================
echo     STARTING BLINKIT CLONE (DEV MODE)
echo ===================================================
echo.
echo [1/2] Stopping existing python processes (if any)...
taskkill /F /IM python.exe >nul 2>&1
echo.

echo [2/2] Starting Backend on 0.0.0.0:8000 (Accessible via WiFi)...
start cmd /k "cd backend && python manage.py runserver 0.0.0.0:8000"

echo.
echo [DONE] Backend started.
echo ---------------------------------------------------
echo -> Backend URL (Local): http://127.0.0.1:8000
echo -> Backend URL (WiFi):  http://192.168.29.231:8000
echo ---------------------------------------------------
echo.
echo Please ensure your Frontend (npm run dev -- --host) is also running in a separate terminal.
echo.
pause
