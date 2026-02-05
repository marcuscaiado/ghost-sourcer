@echo off
color 0A
title Ghost-Sourcer v6.0 - Setup

echo.
echo ========================================
echo   Ghost-Sourcer v6.0 - Setup
echo   by Marcus Caiado
echo ========================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js first:
    echo https://nodejs.org/
    echo.
    echo Download the LTS version (left button)
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i found!
)

echo.

REM Check Ollama
echo [2/4] Checking Ollama...
where ollama >nul 2>&1
if errorlevel 1 (
    color 0E
    echo.
    echo [WARNING] Ollama not found!
    echo.
    echo You need to install Ollama to use local AI:
    echo https://ollama.ai/
    echo.
    echo After installing, run in terminal:
    echo ollama pull llama3
    echo.
    echo (Or you can use Groq cloud instead - see README)
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo [OK] Ollama found!
    
    REM Check if llama3 model is pulled
    ollama list 2>nul | find "llama3" >nul 2>&1
    if errorlevel 1 (
        color 0E
        echo.
        echo [WARNING] Llama 3 model not downloaded!
        echo.
        echo Run this command in another terminal:
        echo ollama pull llama3
        echo.
        echo Press any key to continue...
        pause >nul
    ) else (
        echo [OK] Llama 3 model installed!
    )
)

echo.

REM Install npm dependencies
echo [3/4] Installing Node.js dependencies...
echo This may take a few minutes...
echo.
call npm install
if errorlevel 1 (
    color 0C
    echo.
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Try running these commands manually:
    echo   npm cache clean --force
    echo   npm install
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo [OK] Dependencies installed!
)

echo.

REM Final message
color 0A
echo [4/4] Setup complete!
echo.
echo ========================================
echo   INSTALLATION SUCCESSFUL!
echo ========================================
echo.
echo Next steps:
echo 1. Close this window
echo 2. Double-click START.bat
echo.
echo ========================================
echo.
pause
