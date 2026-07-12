@echo off
title EcoSphere ESG - Setup
cd /d "%~dp0"

echo ========================================
echo  Setting up EcoSphere ESG Platform
echo ========================================
echo.

REM Setup API
echo [1/4] Installing API dependencies...
cd apps\api
call npm install --ignore-scripts
call npx prisma generate
call npx prisma migrate deploy
call npx ts-node prisma\seed.ts
call npx nest build
echo [1/4] API setup complete!
echo.

REM Setup Web
echo [2/4] Installing Web dependencies...
cd ..\web
call npm install --ignore-scripts
echo [2/4] Web setup complete!
echo.

REM Create .env for API if not exists
echo [3/4] Creating .env files...
cd ..\api
if not exist .env (
  echo DATABASE_URL="file:./dev.db" > .env
  echo JWT_SECRET="ecosphere-jwt-secret-super-secure-2026" >> .env
  echo JWT_REFRESH_SECRET="ecosphere-refresh-secret-2026" >> .env
  echo PORT=4000 >> .env
  echo FRONTEND_URL="http://localhost:3000" >> .env
  echo [API .env created]
) else (
  echo [API .env exists]
)
echo [3/4] .env files ready!
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo  To start the servers, run: start.bat
echo ========================================
pause
