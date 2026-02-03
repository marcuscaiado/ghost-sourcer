# 🚀 Guia Rápido para Recrutadores

## Instalação (Fazer UMA VEZ)

### Passo 1: Instale o Node.js
1. Acesse: https://nodejs.org/
2. Clique no botão **LTS** (esquerda)
3. Execute o instalador baixado
4. Clique "Next" até finalizar

### Passo 2: Instale o Ollama
1. Acesse: https://ollama.ai/
2. Clique em "Download"
3. Execute o instalador
4. Abra o **Terminal/Command Prompt** e digite:
   ```
   ollama pull llama3
   ```
5. Aguarde o download (~5GB, 10-15 minutos)

### Passo 3: Configure o Ghost-Sourcer
1. Baixe este projeto do GitHub (botão verde "Code" → "Download ZIP")
2. Extraia o arquivo ZIP
3. **Clique duas vezes em `SETUP.bat`**
4. Aguarde a instalação terminar

---

## Uso Diário (Toda vez que for usar)

### É muito simples:

1. **Clique duas vezes em `START.bat`**
2. Aguarde o navegador abrir sozinho
3. Cole a vaga no campo de cima
4. Selecione o PDF do currículo
5. Clique em "ANALISAR PDF NA GPU"
6. Aguarde 5-10 segundos

**Pronto!** O resultado aparece na tela.

---

## ❓ Problemas Comuns

### "Erro na conexão"
- Você esqueceu de rodar o `START.bat`
- Não abra o `index.html` diretamente!

### "Ollama não encontrado"
- Instale o Ollama: https://ollama.ai/
- Rode: `ollama pull llama3`
- Reinicie o computador

### "Module not found"
- Rode o `SETUP.bat` novamente
- Certifique-se que o Node.js está instalado

### O PDF não funciona
- Certifique-se que é um PDF com texto (não imagem escaneada)
- Tente exportar o currículo como um novo PDF
- Arquivo deve ter menos de 10MB

---

## 🎯 Dicas de Uso

### Para melhores resultados:

1. **Seja específico na JD**
   - Liste tecnologias obrigatórias vs desejáveis
   - Inclua nível de senioridade esperado
   - Mencione métricas de impacto desejadas

2. **Entenda a análise**
   - O AI busca "Equivalência Arquitetural"
   - Docker Swarm → entende Kubernetes
   - AWS → fundamentos aplicáveis ao GCP
   - Foca em impacto, não em buzzwords

3. **Use como triagem inicial**
   - Não substitui entrevista técnica
   - Use para filtrar 100 CVs → 10-15 finalistas
   - Candidatos com score 7+ merecem atenção

---

## 📞 Suporte

Problemas? Abra uma "Issue" no GitHub ou me contate:

LinkedIn: [Marcus Caiado](https://linkedin.com/in/seu-perfil)

**Boa triagem! 🎯**
