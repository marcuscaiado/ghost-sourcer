import express from 'express';
import ollama from 'ollama';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json());

app.post('/api/screen', upload.single('pdf'), async (req, res) => {
    try {
        const { jd } = req.body;
        let resumeText = "";

        if (req.file) {
            console.log(`📄 Processando ${req.file.originalname}...`);
            
            // Try to import pdf-parse dynamically
            try {
                const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
                const pdfData = await pdfParse(req.file.buffer);
                resumeText = pdfData.text;
            } catch (pdfError) {
                // If pdf-parse fails, try a simple text extraction
                console.log("⚠️ Usando extração básica de texto...");
                resumeText = req.file.buffer.toString('utf-8', 0, Math.min(req.file.buffer.length, 50000));
            }
        }

        if (!jd) {
            return res.status(400).json({ error: "Faltou a descrição da vaga (JD)!" });
        }

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({ error: "Não consegui extrair texto do PDF. Tente outro arquivo." });
        }

        console.log("🚀 Llama 3 analisando na GPU...");
        const response = await ollama.chat({
            model: 'llama3',
            messages: [{ 
                role: 'user', 
                content: `Aja como Staff Recruiter do Google. Analise o currículo para a vaga.
                Dê pontos fortes, fracos e nota 0-10.
                
                VAGA (JD): ${jd}
                
                CURRÍCULO: ${resumeText}` 
            }],
        });

        res.json({ analysis: response.message.content });
    } catch (error) {
        console.error("❌ Erro:", error.message);
        res.status(500).json({ error: `Erro: ${error.message}` });
    }
});

app.listen(3001, () => {
    console.log("✅ Ghost-Sourcer v3.0 Ativo na porta 3001");
    console.log("📍 Rodando em Osasco na RTX 5060 Ti");
});