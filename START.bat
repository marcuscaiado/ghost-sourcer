@echo off
color 0A
title Ghost-Sourcer - Servidor Ativo

echo.
echo ========================================
echo   Ghost-Sourcer v3.0
echo   Iniciando servidor local...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    color 0C
    echo [ERRO] Dependencias nao instaladas!
    echo.
    echo Por favor, rode SETUP.bat primeiro.
    echo.
    pause
    exit /b 1
)

REM Try to start Ollama if not running
echo [1/3] Verificando Ollama...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Ollama nao esta rodando. Tentando iniciar...
    
    REM Try common Ollama installation paths
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" (
        start "" "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" serve
        timeout /t 3 >nul
        echo [OK] Ollama iniciado!
    ) else if exist "C:\Program Files\Ollama\ollama.exe" (
        start "" "C:\Program Files\Ollama\ollama.exe" serve
        timeout /t 3 >nul
        echo [OK] Ollama iniciado!
    ) else (
        color 0E
        echo [AVISO] Nao consegui iniciar o Ollama automaticamente.
        echo Por favor, abra o Ollama manualmente.
        echo.
        pause
    )
) else (
    echo [OK] Ollama ja esta rodando!
)

echo.

REM Start Node.js server in new window
echo [2/3] Iniciando servidor Node.js...
start "Ghost-Sourcer Server - NAO FECHE ESTA JANELA" cmd /k "color 0B && node server.js"

REM Wait for server to start
timeout /t 2 >nul

echo [OK] Servidor iniciado na porta 3001!
echo.

REM Open browser with the interface
echo [3/3] Abrindo interface no navegador...
start "" "index.html"

echo [OK] Interface aberta!
echo.
echo ========================================
echo   GHOST-SOURCER ESTA ATIVO!
echo ========================================
echo.
echo A interface foi aberta no seu navegador.
echo Uma janela preta do servidor esta rodando.
echo.
echo [IMPORTANTE]
echo NAO FECHE a janela do servidor!
echo Para desligar, feche aquela janela preta.
echo.
echo ========================================
echo.
echo Pressione qualquer tecla para fechar esta janela
echo (O servidor continuara rodando)
pause >nul
