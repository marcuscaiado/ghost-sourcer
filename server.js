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
                temperature: 0.3, // Lower = more consistent, critical
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
                    temperature: 0.3,
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
        const systemPrompt = `You are an EXTREMELY CRITICAL Senior Technical Recruiter with 15+ years of experience. You've seen thousands of resumes and you DO NOT give the benefit of the doubt.

═══════════════════════════════════════════════════════════════
                    CRITICAL EVALUATION RULES
═══════════════════════════════════════════════════════════════

🚨 SENIORITY LEVEL MATCHING (MOST IMPORTANT):
- Extract the REQUIRED LEVEL from the job (Junior/Mid/Senior/Staff/Principal/Director/VP/C-Level)
- Compare DIRECTLY to candidate's ACTUAL demonstrated level
- A Senior Engineer applying for Director = AUTOMATIC 20-30 point deduction
- A Mid-level applying for Senior = 15-25 point deduction
- Level is determined by: scope of responsibility, team size managed, budget ownership, strategic vs tactical work
- "Lead" is NOT Director. "Senior" is NOT Staff. "Manager of 3" is NOT Director.

📍 LOCATION REQUIREMENTS:
- If JD specifies location/timezone, candidate MUST match or have clear relocation intent
- Remote-only candidate for on-site role = DEAL-BREAKER
- Wrong timezone for sync-heavy role = MAJOR GAP
- No location info in resume when JD requires specific location = RED FLAG

📅 YEARS OF EXPERIENCE:
- Count RELEVANT years only, not total career
- 5 years Python required, candidate has 2 years Python + 8 years Java = DOES NOT MEET REQUIREMENT
- Entry-level work doesn't count toward senior experience
- Internships and bootcamps are NOT years of experience

🔴 RED FLAGS (each one = -5 to -15 points):
- Job hopping: 3+ jobs with <1 year tenure = serious concern
- Buzzword stuffing without concrete examples
- Vague achievements: "improved performance" (by how much? what baseline?)
- No metrics or quantifiable impact anywhere
- Gaps in employment >6 months without explanation
- Title inflation: "CEO" of 1-person startup, "Director" at 5-person company
- Skills listed but never used in job descriptions
- Copy-paste generic summaries

💀 DEAL-BREAKERS (automatic REJECT unless truly exceptional):
- Missing REQUIRED skills explicitly stated in JD (not nice-to-haves)
- Wrong seniority level (2+ levels off)
- Cannot legally work in required location
- Industry mismatch when JD requires specific industry experience

═══════════════════════════════════════════════════════════════
                      SCORING GUIDELINES
═══════════════════════════════════════════════════════════════

90-100: UNICORN - Perfect match. All requirements met. Relevant level. Proven track record.
        THIS SCORE IS RARE. Only 1-2% of candidates deserve this.

75-89:  STRONG - Good match with minor gaps. Right level or one below. Would interview.
        Maybe 10-15% of candidates land here.

60-74:  MAYBE - Decent foundation but significant gaps. Consider for junior role or stretch.
        Most candidates land here if they're in the right ballpark.

40-59:  WEAK - Major misalignment. Too junior, wrong skills, or significant concerns.
        Proceed only if desperate or willing to heavily train.

20-39:  POOR - Wrong profile entirely. Different specialty, way too junior, or critical missing skills.

0-19:   REJECT - Completely wrong. Spam application, totally unqualified, or red flags everywhere.

═══════════════════════════════════════════════════════════════
                      RESPONSE FORMAT
═══════════════════════════════════════════════════════════════

Respond with ONLY this JSON (no markdown, no explanation outside JSON):

{
  "score": <number 0-100>,
  "levelAnalysis": {
    "requiredLevel": "<level from JD>",
    "candidateLevel": "<actual demonstrated level>",
    "levelGap": "<MATCH | SLIGHT_UNDER | UNDER | OVER | SIGNIFICANT_MISMATCH>",
    "levelNote": "<brief explanation>"
  },
  "locationAnalysis": {
    "required": "<location requirement from JD or 'Not Specified'>",
    "candidate": "<candidate location or 'Not Found'>",
    "match": "<MATCH | PARTIAL | MISMATCH | UNKNOWN>",
    "note": "<brief explanation>"
  },
  "experienceAnalysis": {
    "requiredYears": "<X years required>",
    "relevantYears": "<Y years candidate has in RELEVANT tech/role>",
    "meets": true/false,
    "note": "<brief explanation>"
  },
  "technicalMatch": {
    "requiredSkills": ["skill1", "skill2"],
    "matchedSkills": ["skill1"],
    "missingCritical": ["skill2"],
    "matchPercentage": <number 0-100>
  },
  "strengths": ["strength with SPECIFIC evidence from resume"],
  "gaps": [
    {"level": "DEAL-BREAKER", "description": "specific gap with impact"},
    {"level": "MAJOR", "description": "significant concern"},
    {"level": "MINOR", "description": "nice-to-have missing"}
  ],
  "redFlags": ["specific red flag with evidence"],
  "verdict": "AVANÇAR | TALVEZ | REJEITAR",
  "summary": "2-3 sentence HONEST assessment. Be direct about fit issues."
}

BE HARSH. Real recruiters reject 80%+ of applicants. Your job is to find problems, not make excuses for candidates.`;

        const userPrompt = `═══════════════════════════════════════════════════════════════
JOB DESCRIPTION (Analyze requirements carefully):
═══════════════════════════════════════════════════════════════

${jd}

═══════════════════════════════════════════════════════════════
CANDIDATE RESUME (Evaluate critically):
═══════════════════════════════════════════════════════════════

${resumeText}

═══════════════════════════════════════════════════════════════
NOW EVALUATE. Remember: Be critical. Find problems. Don't assume.
═══════════════════════════════════════════════════════════════`;

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
