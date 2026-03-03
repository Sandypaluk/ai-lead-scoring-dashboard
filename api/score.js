import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function extractJSON(text) {
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error('Claude did not return a valid JSON array. Raw response: ' + text.slice(0, 300));
  }
  return text.substring(start, end + 1);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const csvPath = path.join(__dirname, '..', 'leads.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const leads = parseCSV(csvContent);

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

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content[0].text;
    const jsonText = extractJSON(rawText);
    const scores = JSON.parse(jsonText);

    if (!Array.isArray(scores) || scores.length === 0) {
      throw new Error('Claude returned an empty or invalid scores array');
    }

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

    res.status(200).json(scoredLeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
