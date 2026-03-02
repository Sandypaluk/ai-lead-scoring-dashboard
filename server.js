import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Parse CSV once at startup.
// Notes field may contain commas (unquoted), so we join everything
// from the notes column index onward into a single notes value.
function parseCSV(content) {
  const lines = content.split('\n').filter((l) => l.trim());
  const headers = lines[0].split(',').map((h) => h.trim());
  const notesIdx = headers.indexOf('notes');

  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    const record = {};
    headers.forEach((h, i) => {
      if (i < notesIdx) {
        record[h] = parts[i]?.trim() ?? '';
      } else if (i === notesIdx) {
        record[h] = parts.slice(notesIdx).join(',').trim();
      }
    });
    return record;
  });
}

const csvPath = path.join(__dirname, 'leads.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const leads = parseCSV(csvContent);

console.log(`\n✅ Loaded ${leads.length} leads from leads.csv`);

function extractJSON(text) {
  // Strip any markdown code fences if Claude wraps the response
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error('Claude did not return a valid JSON array. Raw response: ' + text.slice(0, 300));
  }
  return text.substring(start, end + 1);
}

// POST /api/score — send all leads to Claude in one call and return scored+ranked list
app.post('/api/score', async (req, res) => {
  const client = new Anthropic();

  const leadLines = leads
    .map(
      (lead, i) =>
        `${i + 1}. ${lead.name} | ${lead.country} | €${lead.budget_eur} | ${lead.location_interest} | ${lead.bedrooms_wanted}-bed | engagement:${lead.engagement_score}/10 | source:${lead.lead_source} | ${lead.days_in_pipeline} days in pipeline | notes: "${lead.notes}"`
    )
    .join('\n');

  const prompt = `You are an expert sales analyst for MYNE Homes, a premium luxury vacation home co-ownership company. Properties are €100k–€500k+ ownership shares in high-end villas across Mallorca, Tuscany, French Riviera, Algarve, and the Maldives.

Score each of the following ${leads.length} leads from 0–100 using these weighted criteria:

1. BUDGET (30%): €450k+ → 90–100pts | €350–449k → 75–89pts | €250–349k → 58–74pts | €150–249k → 38–57pts | below €150k → 5–37pts
2. ENGAGEMENT SCORE (25%): 9–10 = excellent | 7–8 = good | 5–6 = moderate | 3–4 = low | 1–2 = minimal
3. DAYS IN PIPELINE (20%): 0–10 = very fresh (+bonus) | 11–25 = fresh | 26–45 = aging | 46–70 = stale (penalty) | 70+ = very stale (heavy penalty)
4. LOCATION INTEREST (15%): Maldives & French Riviera = premium (+bonus) | Mallorca & Tuscany = high | Algarve = standard
5. LEAD SOURCE (10%): referral = best | webinar = good | direct = good | instagram = moderate | google_ads = lower

Also carefully read the notes for urgency signals (wants to close this quarter, arranging site visit, ready to commit = big bonus), competitor risk, stale or non-responsive signals (hasn't opened emails, rescheduled = penalty), and intent clarity.

Return ONLY a valid JSON array. No markdown. No code blocks. No explanation text. Just the raw JSON starting with [ and ending with ].

Each object must have exactly:
- "name": string (exact name as listed)
- "score": integer 0–100
- "reason": string (one concise sentence, max 20 words, stating the primary score driver)

Leads to score:
${leadLines}

Return only the JSON array.`;

  try {
    console.log(`\n🤖 Sending all ${leads.length} leads to Claude (claude-sonnet-4-20250514)...`);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content[0].text;
    console.log(`✅ Claude responded (${rawText.length} chars)`);

    const jsonText = extractJSON(rawText);
    const scores = JSON.parse(jsonText);

    if (!Array.isArray(scores) || scores.length === 0) {
      throw new Error('Claude returned an empty or invalid scores array');
    }

    console.log(`📊 Parsed ${scores.length} scored leads`);

    // Merge AI scores back with original lead data and add rank
    const scoredLeads = leads
      .map((lead) => {
        const scoreData = scores.find((s) => s.name === lead.name);
        return {
          ...lead,
          budget_eur: parseInt(lead.budget_eur, 10),
          engagement_score: parseInt(lead.engagement_score, 10),
          days_in_pipeline: parseInt(lead.days_in_pipeline, 10),
          bedrooms_wanted: parseInt(lead.bedrooms_wanted, 10),
          ai_score: scoreData ? scoreData.score : 0,
          ai_reason: scoreData ? scoreData.reason : 'Score unavailable',
        };
      })
      .sort((a, b) => b.ai_score - a.ai_score)
      .map((lead, i) => ({ ...lead, rank: i + 1 }));

    res.json(scoredLeads);
  } catch (error) {
    console.error('❌ Scoring error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🏠 MYNE Homes Lead Scoring API → http://localhost:${PORT}`);
  console.log(`📋 ${leads.length} leads loaded and ready\n`);
});
