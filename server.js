import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF Parse
let pdfParse;
try {
    const module = await import('pdf-parse/lib/pdf-parse.js');
    pdfParse = module.default;
} catch (e) {
    try {
        pdfParse = (await import('pdf-parse')).default;
    } catch (e2) {
        console.error("❌ pdf-parse não encontrado. Execute: npm install pdf-parse");
        process.exit(1);
    }
}

const app = express();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// 🔧 AI CONFIG - Groq (cloud) ou Ollama (local)
// ------------------------------------------------------------------
const AI_CONFIG = {
    groq: {
        apiKey: process.env.GROQ_API_KEY || '',
        model: 'llama-3.1-70b-versatile',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions'
    },
    ollama: {
        model: 'dolphin-llama3:latest',
        endpoint: 'http://localhost:11434/api/chat'
    }
};

async function getProvider() {
    if (AI_CONFIG.groq.apiKey && AI_CONFIG.groq.apiKey.length > 10) {
        return 'groq';
    }
    try {
        const res = await fetch('http://localhost:11434/api/tags');
        if (res.ok) return 'ollama';
    } catch (e) {}
    return null;
}

async function callAI(systemPrompt, userPrompt) {
    const provider = await getProvider();
    
    if (!provider) {
        throw new Error('Nenhum provedor de IA disponível. Configure GROQ_API_KEY ou inicie o Ollama.');
    }
    
    console.log(`[AI] Provider: ${provider.toUpperCase()}`);
    
    if (provider === 'groq') {
        const response = await fetch(AI_CONFIG.groq.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.groq.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.groq.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.1, // Very low = consistent, deterministic
                max_tokens: 3000
            })
        });
        
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Groq error: ${err}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    if (provider === 'ollama') {
        const response = await fetch(AI_CONFIG.ollama.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: AI_CONFIG.ollama.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                stream: false,
                options: {
                    temperature: 0.1,
                    num_predict: 3000
                }
            })
        });
        
        const data = await response.json();
        
        // Debug: log the response structure
        console.log('[OLLAMA RAW]', JSON.stringify(data).substring(0, 200));
        
        // Handle different Ollama response formats
        if (data.message && data.message.content) {
            return data.message.content;
        } else if (data.response) {
            // Older Ollama format
            return data.response;
        } else if (data.content) {
            return data.content;
        } else {
            console.error('[OLLAMA] Unexpected response format:', data);
            throw new Error('Unexpected Ollama response format');
        }
    }
}

// ------------------------------------------------------------------
// 📊 System Info
// ------------------------------------------------------------------
app.get('/api/system-info', async (req, res) => {
    const provider = await getProvider();
    
    if (provider === 'groq') {
        res.json({ 
            platform: 'Cloud', 
            model: AI_CONFIG.groq.model, 
            status: 'online',
            provider: 'Groq'
        });
    } else if (provider === 'ollama') {
        res.json({ 
            platform: 'Local', 
            model: AI_CONFIG.ollama.model, 
            status: 'online',
            provider: 'Ollama'
        });
    } else {
        res.json({ 
            platform: 'N/A', 
            model: 'none', 
            status: 'offline',
            provider: 'Nenhum'
        });
    }
});

// ------------------------------------------------------------------
// 🎯 Main Screening Endpoint
// ------------------------------------------------------------------
app.post('/api/screen', upload.single('pdf'), async (req, res) => {
    const startTime = Date.now();
    console.log(`\n[${new Date().toISOString()}] Nova análise`);

    try {
        const { jd } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "Arquivo PDF não encontrado." });
        }
        
        if (!jd || jd.trim().length < 20) {
            return res.status(400).json({ error: "Descrição da vaga muito curta." });
        }

        console.log(`[PARSE] ${req.file.originalname}`);
        
        let resumeText = "";
        
        try {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text.trim();
            const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
            console.log(`[OK] ${wordCount} palavras`);

            if (wordCount < 30) {
                return res.status(400).json({ error: "PDF sem texto suficiente." });
            }
        } catch (pdfError) {
            console.error(`[PDF ERROR] ${pdfError.message}`);
            return res.status(400).json({ error: "Não foi possível ler o PDF." });
        }

        // ------------------------------------------------------------------
        // 🎯 CRITICAL PROMPT - Harsh & Realistic Screening
        // ------------------------------------------------------------------
        const systemPrompt = `You are a strict resume screener. Output ONLY valid JSON.

STRICT SCORING RULES - YOU MUST FOLLOW THESE:

START AT 70 POINTS, THEN APPLY PENALTIES:

LEVEL MISMATCH PENALTIES (MANDATORY):
- Candidate level matches required: 0 penalty
- Candidate 1 level below (e.g., Mid for Senior): -15 points
- Candidate 2+ levels below (e.g., Junior for Senior, Senior for Director): -30 points
- "Tech Recruiter" is NOT "Senior Technical Recruiter" = -15 points

LOCATION PENALTIES (MANDATORY):
- Location matches or remote OK: 0 penalty
- Location mismatch (different country/city when on-site required): -20 points
- Brazil candidate for Singapore role = MISMATCH = -20 points

EXPERIENCE PENALTIES:
- Meets years requirement: 0 penalty
- 1-2 years short: -10 points
- 3+ years short: -20 points

SKILL PENALTIES:
- Each missing REQUIRED skill: -10 points
- Less than 50% skill match: -15 points

RED FLAG PENALTIES:
- Job hopping (3+ jobs <1 year each): -10 points
- No metrics/numbers in achievements: -5 points
- Buzzwords without examples: -5 points

BONUSES (max +30):
- Exceeds experience requirement: +5
- Has nice-to-have skills: +5 each (max +10)
- Strong metrics and achievements: +10
- Perfect level match: +5

FINAL SCORE = 70 + bonuses - penalties (min 0, max 100)

VERDICT RULES:
- Score >= 75: "AVANÇAR"
- Score 50-74: "TALVEZ"  
- Score < 50: "REJEITAR"

OUTPUT THIS EXACT JSON STRUCTURE:
{"score":0,"penalties":{"level":-0,"location":-0,"experience":-0,"skills":-0,"redFlags":-0},"bonuses":0,"levelAnalysis":{"requiredLevel":"","candidateLevel":"","levelGap":"MATCH|UNDER|OVER"},"locationAnalysis":{"required":"","candidate":"","match":"MATCH|MISMATCH"},"experienceAnalysis":{"requiredYears":"","relevantYears":"","meets":true},"technicalMatch":{"matchedSkills":[],"missingCritical":[],"matchPercentage":0},"strengths":[],"gaps":[{"level":"DEAL-BREAKER|MAJOR|MINOR","description":""}],"redFlags":[],"verdict":"AVANÇAR|TALVEZ|REJEITAR","summary":"2 sentences about fit, mention specific gaps"}`;

        const userPrompt = `ANALYZE THIS:

JOB REQUIREMENTS:
${jd}

CANDIDATE RESUME:
${resumeText}

Calculate score starting at 70, apply all penalties and bonuses. Output JSON only:`;

        const aiResponse = await callAI(systemPrompt, userPrompt);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const provider = await getProvider();
        
        console.log(`[DONE] ${duration}s`);

        // Parse JSON response
        let analysis = null;
        let raw = aiResponse;
        
        try {
            let cleanResponse = aiResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            
            // Try to extract JSON if there's text around it
            const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[0];
            }
            
            analysis = JSON.parse(cleanResponse);
            raw = null;
            
            // Validate score is reasonable
            if (analysis.score > 85) {
                console.log(`[WARN] High score ${analysis.score} - verify manually`);
            }
            
        } catch (parseError) {
            console.log(`[WARN] JSON parse failed, using raw response`);
        }

        res.json({ 
            analysis,
            raw,
            meta: { 
                duration: `${duration}s`, 
                resumeWords: resumeText.split(/\s+/).length, 
                model: provider === 'groq' ? AI_CONFIG.groq.model : AI_CONFIG.ollama.model,
                provider: provider
            }
        });

    } catch (error) {
        console.error("❌ ERRO:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------------------------------
// 📊 Serve static files
// ------------------------------------------------------------------
app.use(express.static(__dirname));

// ------------------------------------------------------------------
// 🚀 Start
// ------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    const provider = await getProvider();
    console.log("\n╔═════════════════════════════════════════╗");
    console.log("║     👻 GHOST-SOURCER v6.0 (CRITICAL)    ║");
    console.log("╠═════════════════════════════════════════╣");
    console.log(`║  🌐 http://localhost:${PORT}               ║`);
    console.log(`║  🤖 ${(provider || 'OFFLINE').toUpperCase().padEnd(31)}║`);
    console.log("║  ⚠️  HARSH MODE ENABLED                  ║");
    console.log("╚═════════════════════════════════════════╝\n");
    
    if (!provider) {
        console.log("⚠️  SETUP:");
        console.log("   1. Groq (cloud): GROQ_API_KEY=xxx node server.js");
        console.log("   2. Ollama (local): ollama serve\n");
    }
});
