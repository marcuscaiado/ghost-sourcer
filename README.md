# 👻 Ghost-Sourcer
**AI-Powered Local Resume Screener for Recruiters**

---

## 🇧🇷 Português

Eu desenvolvi o **Ghost-Sourcer** para realizar triagens técnicas rodando **100% localmente**. Como Recrutador Técnico, entendo que a privacidade dos dados dos candidatos é um pilar inegociável da nossa profissão. Esta ferramenta permite um processamento especializado diretamente no meu hardware, utilizando o poder do **Llama 3**.

### 🚀 Por que eu criei esta ferramenta?
* **Privacidade Total**: Desenvolvi o sistema para que o currículo nunca saia da máquina local, garantindo conformidade nativa com **LGPD/GDPR**.
* **Equivalência Arquitetural**: Fui além do mapeamento de palavras-chave; o agente analisa se as competências técnicas são transferíveis entre ecossistemas, como validar experiência em AWS para um stack baseado em GCP.
* **Custo Zero**: Realizo todo o processamento via **Ollama** utilizando minha própria GPU.

### 🛡️ Por que IA Local (Edge)?
Em um ecossistema de recrutamento moderno, a soberania de dados é prioritária. O Ghost-Sourcer foi desenhado para atuar como uma camada de **Edge Computing** para triagem inicial.
* **Ingestão Zero-Trust**: O processamento local garante que informações sensíveis (PII) permaneçam em um ambiente isolado durante a fase de triagem bruta.
* **Complemento à Compliance**: Funciona como um "sandbox" privado, permitindo validar perfis sem a necessidade imediata de trânsito de dados em redes externas, ideal para lidar com requisitos rigorosos de privacidade.
* **Mapeamento de Princípios**: Ao contrário de filtros estáticos, o modelo local foca em **princípios de engenharia**, identificando talentos que possuem a lógica necessária para o stack, mesmo que os termos exatos variem.

### 🛠️ Minha Stack Técnica
* **Runtime**: Utilizei **Node.js v24.13.0** para implementar suporte a imports dinâmicos e módulos ESM modernos.
* **Backend**: Express.js.
* **AI Engine**: Ollama (Llama 3).
* **Document Parsing**: Implementei o `officeparser` para garantir suporte robusto a arquivos PDF e DOCX.

### 🖥️ Meu Setup de Hardware
Validei este projeto utilizando meu setup pessoal:
* **CPU**: Ryzen 7 8700F.
* **GPU**: **RTX 5060 Ti**, essencial para manter a latência de processamento do Llama 3 reduzida.
* **OS**: Windows com Git Bash.

### 📦 Instalação e Dependências
Eu ignorei a pasta `node_modules` via `.gitignore` seguindo os padrões da indústria. O arquivo `package.json` contém todas as definições necessárias para que as dependências sejam instaladas de forma compatível com o seu ambiente local.

**Para instalar:**
`npm install`

---

## 🇺🇸 English

I built **Ghost-Sourcer** to run technical screenings **100% locally**. As a Tech Recruiter at, I recognize that candidate data privacy is a non-negotiable pillar of our field. This tool enables specialized, local processing by leveraging **Llama 3** directly on my own hardware.

### 🚀 Why I Built This
* **Total Privacy**: I designed this so resumes never leave your machine, ensuring native **LGPD/GDPR** compliance.
* **Architectural Equivalence**: I moved beyond simple keyword matching; the agent analyzes if technical skills are transferable across ecosystems, such as validating AWS experience for a GCP-based stack.
* **Zero Cost**: I run all processing via **Ollama** on my local GPU.

### 🛡️ Why Local Edge AI?
In a modern recruiting ecosystem, data sovereignty is a priority. Ghost-Sourcer is designed to act as an **Edge Computing** layer for initial screening.
* **Zero-Trust Data Ingest**: Local processing ensures that PII (Personally Identifiable Information) remains in an isolated environment during the raw screening phase.
* **Complementing Enterprise Compliance**: It functions as a private "sandbox," allowing you to validate profiles without the immediate need for data transit over external networks, ideal for strict privacy requirements.
* **Engineering-First Mapping**: Unlike static filters, the local model focuses on **engineering principles**, identifying talent with the right logic for your stack, even if exact keywords vary across ecosystems.

### 🛠️ My Tech Stack
* **Runtime**: I chose **Node.js v24.13.0** to take advantage of modern dynamic imports and ESM modules.
* **Backend**: Express.js.
* **AI Engine**: Ollama (Llama 3).
* **Document Parsing**: I integrated `officeparser` for robust PDF and DOCX support.

### 🖥️ Hardware Setup
I validated this project on my personal professional setup in my own home:
* **CPU**: Ryzen 7 8700F.
* **GPU**: **RTX 5060 Ti**, which is critical for low-latency Llama 3 processing.
* **OS**: Windows with Git Bash.

### 📦 Installation
I excluded the `node_modules` folder via `.gitignore` following standard software engineering practices. The `package.json` file contains all the definitions you need to install the dependencies compatible with your own environment.

**To install:**
`npm install`

---

## 🚀 Como Rodar / How to Run
1. **Ollama**: Certifique-se de que o Ollama está ativo com o modelo `llama3` instalado. / Ensure **Ollama** is active with the `llama3` model installed.
2. **Backend**: Inicie o servidor / Start the server: `node server.js`.
3. **UI**: Abra o arquivo `index.html` no seu navegador. / Open `index.html` in your browser.
