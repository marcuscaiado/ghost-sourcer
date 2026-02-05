@echo off
color 0A
title Ghost-Sourcer v6.0 - Server Active

echo.
echo ========================================
echo   Ghost-Sourcer v6.0
echo   Starting local server...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    color 0C
    echo [ERROR] Dependencies not installed!
    echo.
    echo Please run SETUP.bat first.
    echo.
    pause
    exit /b 1
)

REM Try to start Ollama if not running
echo [1/3] Checking Ollama...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Ollama is not running. Attempting to start...
    
    REM Try common Ollama installation paths
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" (
        start "" "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" serve
        timeout /t 3 >nul
        echo [OK] Ollama started!
    ) else if exist "C:\Program Files\Ollama\ollama.exe" (
        start "" "C:\Program Files\Ollama\ollama.exe" serve
        timeout /t 3 >nul
        echo [OK] Ollama started!
    ) else (
        color 0E
        echo [WARNING] Could not start Ollama automatically.
        echo Please open Ollama manually, or use Groq cloud.
        echo.
        echo (If you have GROQ_API_KEY set, this is fine)
        echo.
        timeout /t 3 >nul
    )
) else (
    echo [OK] Ollama is already running!
)

echo.

REM Start Node.js server in new window
echo [2/3] Starting Node.js server...
start "Ghost-Sourcer Server - DO NOT CLOSE" cmd /k "color 0B && node server.js"

REM Wait for server to start
timeout /t 2 >nul

echo [OK] Server started on port 3001!
echo.

REM Open browser with the interface
echo [3/3] Opening interface in browser...
timeout /t 1 >nul
start "" "http://localhost:3001"

echo [OK] Interface opened!
echo.
echo ========================================
echo   GHOST-SOURCER IS ACTIVE!
echo ========================================
echo.
echo The interface opened in your browser.
echo A black server window is running.
echo.
echo [IMPORTANT]
echo DO NOT CLOSE the server window!
echo To stop, close that black window.
echo.
echo ========================================
echo.
echo Press any key to close this window
echo (The server will keep running)
pause >nul
