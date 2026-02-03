import express from 'express';
import ollama from 'ollama';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';

// ------------------------------------------------------------------
// 🔧 ESM/CommonJS Bridge for pdf-parse
// ------------------------------------------------------------------
const require = createRequire(import.meta.url);
let pdfParseLib;

try {
    pdfParseLib = require('pdf-parse');
} catch (e) {
    console.error("❌ ERRO: Biblioteca 'pdf-parse' não encontrada.");
    console.error("👉 Execute: npm install pdf-parse");
    process.exit(1);
}

const app = express();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// 📊 System Info Endpoint
// ------------------------------------------------------------------
app.get('/api/system-info', async (req, res) => {
    try {
        const list = await ollama.list();
        const model = list.models.length > 0 ? list.models[0].name : 'llama3';
        res.json({
            platform: process.platform === 'win32' ? 'Windows' : 'Linux/Mac',
            model: model,
            status: 'online'
        });
    } catch (e) {
        res.json({ platform: 'Unknown', model: 'llama3', status: 'offline' });
    }
});

// ------------------------------------------------------------------
// 🎯 Main Screening Endpoint
// ------------------------------------------------------------------
app.post('/api/screen', upload.single('pdf'), async (req, res) => {
    const startTime = Date.now();
    console.log(`\n[${new Date().toISOString()}] Nova análise iniciada`);

    try {
        const { jd } = req.body;
        
        // Input validation
        if (!req.file) {
            return res.status(400).json({ 
                error: "Arquivo PDF não encontrado.",
                tip: "Certifique-se de selecionar um arquivo .pdf válido."
            });
        }
        
        if (!jd || jd.trim().length < 20) {
            return res.status(400).json({ 
                error: "Descrição da vaga muito curta ou ausente.",
                tip: "Cole a descrição completa da vaga para uma análise precisa."
            });
        }

        console.log(`[PARSE] Extraindo texto do PDF: ${req.file.originalname}`);
        
        let resumeText = "";
        
        try {
            const data = await pdfParseLib(req.file.buffer);
            resumeText = data.text.trim();
            const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
            
            console.log(`[OK] ${wordCount} palavras extraídas do PDF`);

            if (wordCount < 30) {
                return res.status(400).json({ 
                    error: "PDF sem texto extraível suficiente.",
                    tip: "O arquivo pode ser uma imagem escaneada. Tente um PDF com texto selecionável."
                });
            }

        } catch (pdfError) {
            console.error(`[ERRO] Falha no parsing: ${pdfError.message}`);
            return res.status(400).json({ 
                error: "Não foi possível ler o conteúdo do PDF.",
                tip: "Verifique se o arquivo não está corrompido ou protegido por senha."
            });
        }

        // ------------------------------------------------------------------
        // 🧠 Generalist Analysis Prompt
        // ------------------------------------------------------------------
        const systemPrompt = `Você é um Recrutador Sênior experiente em avaliar candidatos para QUALQUER tipo de vaga.

INSTRUÇÕES CRÍTICAS:
1. Analise o currículo contra a descrição da vaga de forma HOLÍSTICA
2. Identifique COMPETÊNCIAS TRANSFERÍVEIS - habilidades que se aplicam mesmo com nomenclaturas diferentes
3. Considere EQUIVALÊNCIAS:
   - Técnicas: AWS ≈ GCP ≈ Azure (cloud), React ≈ Vue ≈ Angular (frontend)
   - Metodológicas: Scrum ≈ Kanban ≈ SAFe (ágil)
   - De papel: Tech Lead ≈ Engineering Manager (liderança técnica)
4. Seja realista sobre GAPS - mas diferencie "falta crítica" de "curva de aprendizado"
5. Considere senioridade e progressão de carreira

FORMATO DE RESPOSTA (HTML):
<div class="analysis">
  <div class="score">
    <span class="number">[0-100]</span>
    <span class="label">Match Score</span>
  </div>
  
  <h3>✅ Pontos Fortes</h3>
  <ul>
    <li>[Ponto relevante com justificativa breve]</li>
  </ul>
  
  <h3>⚠️ Gaps Identificados</h3>
  <ul>
    <li>[Gap com nível de criticidade: CRÍTICO / MÉDIO / BAIXO]</li>
  </ul>
  
  <h3>🎯 Veredito</h3>
  <p>[Recomendação clara: AVANÇAR / AVALIAR MELHOR / NÃO RECOMENDADO + justificativa em 1-2 frases]</p>
</div>`;

        console.log(`[AI] Enviando para Llama 3...`);
        
        const response = await ollama.chat({
            model: 'llama3',
            messages: [
                { role: 'system', content: systemPrompt },
                { 
                    role: 'user', 
                    content: `DESCRIÇÃO DA VAGA:\n${jd}\n\n---\n\nCURRÍCULO DO CANDIDATO:\n${resumeText}` 
                }
            ],
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[DONE] Análise concluída em ${duration}s`);

        res.json({ 
            analysis: response.message.content,
            meta: {
                duration: `${duration}s`,
                resumeWords: resumeText.split(/\s+/).length,
                model: 'llama3'
            }
        });

    } catch (error) {
        console.error("❌ Erro interno:", error.message);
        res.status(500).json({ 
            error: "Erro interno do servidor.",
            tip: "Verifique se o Ollama está rodando (ollama serve)."
        });
    }
});

// ------------------------------------------------------------------
// 🚀 Server Start
// ------------------------------------------------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║     👻 GHOST-SOURCER v4.0              ║");
    console.log("║     Local AI Resume Screener           ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(`║  🌐 Server: http://localhost:${PORT}       ║`);
    console.log("║  🔒 100% Local - Zero Cloud            ║");
    console.log("╚════════════════════════════════════════╝\n");
});
