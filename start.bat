@echo off
title EcoSphere ESG - Running
cd /d "%~dp0"

echo ========================================
echo  Starting EcoSphere ESG Platform
echo ========================================
echo.

REM Start API
echo [API] Starting backend on http://localhost:4000 ...
cd apps\api
start "EcoSphere-API" /MIN cmd /c "title API Server && node dist\src\main"

REM Wait for API to start
echo [API] Waiting 3 seconds...
timeout /t 3 /nobreak >nul

REM Start Web
echo [WEB] Starting frontend on http://localhost:3000 ...
cd ..\web
start "EcoSphere-Web" /MIN cmd /c "title Web Server && npx next dev -p 3000"

echo.
echo ========================================
echo  BOTH SERVERS STARTING...
echo.
echo  API:  http://localhost:4000
echo       Login: POST /api/auth/login
echo       Docs:  http://localhost:4000/api/docs
echo.
echo  Web:  http://localhost:3000
echo       Login: admin@ecosphere.com / admin123
echo.
echo  Close this window to stop both servers.
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping servers...
taskkill /f /im node.exe >nul 2>&1
echo Servers stopped.
