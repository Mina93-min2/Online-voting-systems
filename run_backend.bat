@echo off
echo Checking for Node.js...
node -v
if %errorlevel% neq 0 (
    echo Node.js is not found in PATH. Please install Node.js from https://nodejs.org/ or restart your terminal if already installed.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting server...
call npm start
pause
