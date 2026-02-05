# 🚀 Guia Rápido para Recrutadores

## 🔒 Privacidade Garantida

O Ghost-Sourcer roda **100% no seu computador**:
- ✅ Nenhum dado vai para a nuvem
- ✅ Nenhuma API externa
- ✅ Currículos processados apenas na memória
- ✅ LGPD/GDPR por design

---

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
5. Aguarde o download (~4GB, 10-15 minutos)

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
5. Clique em "Analyze Candidate"
6. Aguarde 10-30 segundos

**Pronto!** O resultado aparece na tela.

---

## ❓ Problemas Comuns

### "Ollama is not running"
- Abra um terminal e rode: `ollama serve`
- Ou reinicie o computador e tente novamente

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
- Arquivo deve ter menos de 15MB

### Análise muito lenta
- Verifique se sua GPU está sendo usada: `ollama ps`
- Atualize os drivers da placa de vídeo
- Mínimo recomendado: GPU com 8GB VRAM

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
   - Candidatos com score 75+ merecem atenção

---

## 📊 Entendendo os Scores

| Score | Classificação | Ação |
|-------|--------------|------|
| 90-100 | UNICORN | Entrevistar imediatamente |
| 75-89 | STRONG | Avançar para entrevista |
| 60-74 | MAYBE | Revisar manualmente |
| 40-59 | WEAK | Provavelmente rejeitar |
| 0-39 | REJECT | Não atende requisitos |

---

## 🖥️ Hardware Recomendado

Para melhor performance:
- **GPU**: NVIDIA com 8GB+ VRAM (RTX 3060 ou superior)
- **RAM**: 16GB mínimo
- **SSD**: Recomendado para carregar o modelo mais rápido

Sem GPU dedicada? O Ollama também roda em CPU, mas será mais lento.

---

## 📞 Suporte

Problemas? Abra uma "Issue" no GitHub ou me contate:

- GitHub: [github.com/marcuscaiado/ghost-sourcer](https://github.com/marcuscaiado/ghost-sourcer)
- LinkedIn: [Marcus Caiado](https://linkedin.com/in/marcuscaiado)

**Boa triagem! 🎯**
