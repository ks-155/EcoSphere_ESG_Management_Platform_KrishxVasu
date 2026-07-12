@echo off
echo ========================================
echo  EcoSphere ESG - Starting Dev Servers
echo ========================================
echo.
echo Starting API on http://localhost:4000 ...
start "EcoSphere API" cmd /c "cd /d apps\api && node dist\src\main"

echo Starting Web on http://localhost:3000 ...
start "EcoSphere Web" cmd /c "cd /d apps\web && npx next dev -p 3000"

echo.
echo Both servers starting...
echo API:  http://localhost:4000/api/auth/login
echo Web:  http://localhost:3000/login
echo.
echo Login: admin@ecosphere.com / admin123
echo ========================================
