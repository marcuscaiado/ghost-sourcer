# 👻 Ghost-Sourcer v6.0
**100% Local AI Resume Screener for Technical Recruiters**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#)

---

## 🇧🇷 Português

Eu desenvolvi o **Ghost-Sourcer** para realizar triagens técnicas rodando **100% localmente**. Como Recrutador Técnico, entendo que a privacidade dos dados dos candidatos é um pilar inegociável da nossa profissão. Esta ferramenta permite um processamento especializado diretamente no meu hardware, utilizando o poder do **Llama 3** via **Ollama**.

### 🔒 Privacidade Total
- **Zero dados na nuvem**: Nenhuma informação sai da sua máquina
- **Sem APIs externas**: Todo processamento é local
- **LGPD/GDPR nativo**: Compliance por design

### 🚀 Por que eu criei esta ferramenta?
* **Privacidade Total**: O currículo nunca sai da sua máquina local.
* **Equivalência Arquitetural**: Vou além do mapeamento de palavras-chave; o agente analisa se as competências técnicas são transferíveis entre ecossistemas (ex: AWS → GCP).
* **Custo Zero**: Todo o processamento roda via **Ollama** na sua própria GPU.

### 🛡️ Por que IA Local (Edge)?
Em um ecossistema de recrutamento moderno, a soberania de dados é prioritária. O Ghost-Sourcer foi desenhado para atuar como uma camada de **Edge Computing** para triagem inicial.

* **Ingestão Zero-Trust**: Informações sensíveis (PII) permanecem em ambiente isolado.
* **Sandbox Privado**: Valide perfis sem trânsito de dados em redes externas.
* **Mapeamento de Princípios**: Foco em **princípios de engenharia**, não apenas keywords.

### 🛠️ Stack Técnica
* **Runtime**: Node.js v18+ com ES Modules
* **Backend**: Express.js
* **AI Engine**: Ollama + Llama 3 (100% local)
* **Document Parsing**: `pdf-parse` para PDFs

### 🖥️ Hardware Recomendado
* **GPU**: NVIDIA com 8GB+ VRAM (RTX 3060 ou superior)
* **RAM**: 16GB mínimo
* **CPU**: Qualquer processador moderno

---

## 🇺🇸 English

I built **Ghost-Sourcer** to run technical screenings **100% locally**. As a Tech Recruiter, I recognize that candidate data privacy is a non-negotiable pillar of our field. This tool enables specialized processing by leveraging **Llama 3** via **Ollama** directly on your own hardware.

### 🔒 Total Privacy
- **Zero cloud data**: No information leaves your machine
- **No external APIs**: All processing is local
- **LGPD/GDPR native**: Compliance by design

### 🚀 Why I Built This
* **Total Privacy**: Resumes never leave your machine.
* **Architectural Equivalence**: Beyond keyword matching - analyzes if skills transfer across ecosystems (e.g., AWS → GCP).
* **Zero Cost**: All processing runs via **Ollama** on your local GPU.

### 🛡️ Why Local Edge AI?
In modern recruiting, data sovereignty is priority. Ghost-Sourcer acts as an **Edge Computing** layer for initial screening.

* **Zero-Trust Data Ingest**: PII stays in an isolated local environment.
* **Private Sandbox**: Validate profiles without external network transit.
* **Engineering-First Mapping**: Focus on **engineering principles**, not just keywords.

### 🛠️ Tech Stack
* **Runtime**: Node.js v18+ with ES Modules
* **Backend**: Express.js
* **AI Engine**: Ollama + Llama 3 (100% local)
* **Document Parsing**: `pdf-parse` for PDFs

### 🖥️ Recommended Hardware
* **GPU**: NVIDIA with 8GB+ VRAM (RTX 3060 or better)
* **RAM**: 16GB minimum
* **CPU**: Any modern processor

---

## 📦 Installation

### Quick Start (Windows)

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/) (LTS version)
   - Run installer, click Next until done

2. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai/)
   - Run installer
   - Open terminal and run:
     ```bash
     ollama pull llama3
     ```
   - Wait for download (~4GB)

3. **Setup Ghost-Sourcer**
   ```bash
   git clone https://github.com/marcuscaiado/ghost-sourcer.git
   cd ghost-sourcer
   ```
   - Double-click `SETUP.bat`
   - Wait for dependencies to install

4. **Run**
   - Double-click `START.bat`
   - Browser opens automatically

### Manual Installation (Mac/Linux)

```bash
# Clone repository
git clone https://github.com/marcuscaiado/ghost-sourcer.git
cd ghost-sourcer

# Install dependencies
npm install

# Start Ollama (in separate terminal)
ollama serve

# Pull model (first time only)
ollama pull llama3

# Start server
node server.js

# Open in browser
open http://localhost:3001
```

---

## 🚀 Usage

1. **Paste Job Description** - Include required level, location, skills, experience
2. **Upload Resume PDF** - Drag & drop or click to select
3. **Click Analyze** - Wait 10-30 seconds
4. **Review Results** - Score, verdict, gaps, recommendations

### Scoring System

| Score | Label | Verdict |
|-------|-------|---------|
| 90-100 | UNICORN | ADVANCE |
| 75-89 | STRONG | ADVANCE |
| 60-74 | MAYBE | MAYBE |
| 40-59 | WEAK | REJECT |
| 0-39 | REJECT | REJECT |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `OLLAMA_MODEL` | Model to use | `llama3` |

### Using a Different Model

```bash
# Use Mistral instead
OLLAMA_MODEL=mistral node server.js

# Use Llama 3.1
ollama pull llama3.1
OLLAMA_MODEL=llama3.1 node server.js
```

---

## ❓ Troubleshooting

### "Ollama is not running"
```bash
# Start Ollama service
ollama serve
```

### "Connection Error" in browser
- Make sure you ran `START.bat` or `node server.js`
- Don't open `index.html` directly from file explorer

### "Model not found"
```bash
# Pull the model
ollama pull llama3
```

### Slow performance
- Ensure GPU drivers are updated
- Check that Ollama is using GPU: `ollama ps`
- Try a smaller model: `OLLAMA_MODEL=llama3:8b`

### PDF not working
- Must be text-based PDF (not scanned image)
- Try re-exporting from original source
- Max file size: 15MB

---

## 🔐 Privacy Guarantee

Ghost-Sourcer is designed with privacy as the core principle:

- ✅ **No cloud services** - Everything runs locally
- ✅ **No external APIs** - No data leaves your machine
- ✅ **No telemetry** - No usage tracking
- ✅ **No storage** - Resumes are processed in memory only
- ✅ **Open source** - Audit the code yourself

Your candidates' data stays on YOUR machine. Period.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 👤 Author

**Marcus Caiado**
- LinkedIn: [linkedin.com/in/marcuscaiado](https://linkedin.com/in/marcuscaiado)
- GitHub: [github.com/marcuscaiado](https://github.com/marcuscaiado)

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for making local LLMs accessible
- [Meta](https://llama.meta.com/) for open-sourcing Llama
- The open-source community
