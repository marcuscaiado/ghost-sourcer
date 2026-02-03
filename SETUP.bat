@echo off
color 0A
title Ghost-Sourcer - Setup Automatico

echo.
echo ========================================
echo   Ghost-Sourcer - Instalacao Automatica
echo   by Marcus Caiado @ Google
echo ========================================
echo.

REM Check Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale Node.js primeiro:
    echo https://nodejs.org/
    echo.
    echo Baixe a versao LTS (botao esquerdo)
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js encontrado!
)

echo.

REM Check Ollama
echo [2/4] Verificando Ollama...
where ollama >nul 2>&1
if errorlevel 1 (
    color 0E
    echo.
    echo [AVISO] Ollama nao encontrado!
    echo.
    echo Voce precisa instalar o Ollama para usar o AI:
    echo https://ollama.ai/
    echo.
    echo Depois de instalar, rode no terminal:
    echo ollama pull llama3
    echo.
    echo Pressione qualquer tecla para continuar mesmo assim...
    pause >nul
) else (
    echo [OK] Ollama encontrado!
    
    REM Check if llama3 model is pulled
    ollama list | find "llama3" >nul 2>&1
    if errorlevel 1 (
        color 0E
        echo.
        echo [AVISO] Modelo Llama 3 nao baixado!
        echo.
        echo Rode este comando em outro terminal:
        echo ollama pull llama3
        echo.
        pause
    ) else (
        echo [OK] Modelo Llama 3 instalado!
    )
)

echo.

REM Install npm dependencies
echo [3/4] Instalando dependencias do Node.js...
echo Isso pode demorar alguns minutos...
echo.
call npm install
if errorlevel 1 (
    color 0C
    echo.
    echo [ERRO] Falha na instalacao das dependencias!
    pause
    exit /b 1
) else (
    echo [OK] Dependencias instaladas!
)

echo.

REM Final message
color 0A
echo [4/4] Setup completo!
echo.
echo ========================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Proximo passo:
echo 1. Feche esta janela
echo 2. De dois cliques em START.bat
echo.
echo ========================================
pause
