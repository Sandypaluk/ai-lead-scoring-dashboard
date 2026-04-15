# 📊 AI Lead Scoring Dashboard

An AI-powered sales tool that automatically scores, ranks, and 
prioritises vacation home leads — turning hours of manual sales 
work into a 10-second automated analysis.

Built with Claude API to eliminate manual lead qualification for 
luxury vacation property co-ownership sales teams.

## 🚀 Live Demo
[Live App]([(https://ai-lead-scoring-dashboard-woad.vercel.app/)]) | [Video Walkthrough]([(https://youtu.be/ITVLpOT5x50)])

## 💡 The Problem It Solves
Sales teams waste hours every week manually sorting through leads, 
trying to figure out who to call first. Without a scoring system, 
high-value prospects get lost in the noise and low-quality leads 
consume valuable sales time.

This dashboard eliminates that problem entirely:
- Automatically ranks all leads by AI-generated priority score
- Gives sales reps a clear, reasoned view of who to contact first
- Reduces lead qualification time from hours to seconds
- Ensures no high-value prospect is ever overlooked

## ✨ Features
- **Batch AI scoring** — all 50 leads scored in a single Claude API 
  call, not individual calls per lead
- **Priority rankings** — leads sorted 0-100 with color-coded tiers 
  (green=high, amber=medium, red=low)
- **Gold star highlights** — top 5 leads instantly identified
- **AI reasoning** — every score comes with a plain English 
  explanation of why the lead ranked high or low
- **Pipeline value tracker** — total estimated revenue across all leads
- **Real-time filters** — filter by country, location interest, 
  or priority tier instantly
- **Search** — search across name, country, location, and AI reasoning
- **Rescore button** — re-run the full analysis with one click

## 📊 Business Impact
| Metric | Before | After |
|---|---|---|
| Time to qualify 50 leads | 2-3 hours (manual) | Under 10 seconds |
| Scoring consistency | Varies by sales rep | 100% consistent AI criteria |
| Pipeline visibility | Spreadsheet guesswork | Live ranked dashboard |
| API cost for 50 leads | 50 individual calls | 1 batch call (98% cheaper) |
| Missed high-value leads | Common | Eliminated |

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Vercel Serverless Functions
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Deployment:** Vercel

## ⚙️ Run Locally
```bash
git clone https://github.com/Sandypaluk/ai-lead-scoring-dashboard
cd ai-lead-scoring-dashboard
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

## 🧠 How It Works
1. App loads and automatically reads the leads CSV on startup
2. All 50 leads are sent to Claude API in a single batch call
3. Claude returns a ranked JSON array with scores and reasoning 
   for every lead
4. Dashboard renders instantly with filters, search, and 
   pipeline summary
5. Hit "Rescore All" to re-run the analysis at any time

## ⚡ Engineering Decision: Single Batch API Call
Instead of making 50 individual API calls (slow, expensive, fragile), 
all leads are sent to Claude in one request. This reduces API costs 
by ~98%, cuts response time dramatically, and makes the system more 
reliable. This is the kind of cost-efficiency tradeoff that matters 
at scale.

## 👩‍💻 Built By
Sandra Paluku — AI & Automation Builder
[GitHub](https://github.com/Sandypaluk) | [LinkedIn](www.linkedin.com/in/sk-paluku)
