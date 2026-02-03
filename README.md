# 👻 Ghost-Sourcer
**AI-Powered Local Resume Screener for Recruiters**

---

## 🇧🇷 Português

O **Ghost-Sourcer** é uma ferramenta de triagem técnica desenvolvida para rodar **100% localmente**. Como recrutador e engenheiro no Google, prezo pela privacidade absoluta dos dados de candidatos. Esta aplicação elimina a dependência de nuvens de terceiros e custos de API, utilizando o poder do **Llama 3** diretamente no hardware local.

### 🚀 Por que usar?
* **Privacidade Total**: O currículo nunca sai do seu computador, garantindo conformidade nativa com **LGPD/GDPR**.
* **Equivalência Arquitetural**: Diferente de filtros por palavras-chave, o agente analisa se as competências são transferíveis entre ecossistemas tecnológicos (ex: experiência em AWS validada para um stack GCP).
* **Custo Zero**: Todo o processamento é feito via **Ollama** utilizando sua GPU local.

### 🛠️ Stack Técnica
* **Runtime**: Node.js **v24.13.0** (Necessário para suporte a dynamic imports e módulos ESM).
* **Backend**: Express.js.
* **AI Engine**: Ollama (Llama 3).
* **Document Parsing**: `officeparser` (Suporte robusto a PDF e DOCX).

### 🖥️ Requisitos de Hardware
Projeto validado no seguinte setup profissional em Osasco:
* **CPU**: Ryzen 7 8700F.
* **GPU**: **RTX 5060 Ti** (Recomendada para latência reduzida no processamento de LLM).
* **OS**: Windows com Git Bash.

### 🛠️ Instalação e Dependências
**Por que não subimos a `node_modules`?**
A pasta `node_modules` é ignorada pelo `.gitignore` por boas práticas de engenharia. O arquivo `package.json` já lista todas as bibli
