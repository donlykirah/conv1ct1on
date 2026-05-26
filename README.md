# ⚖️ BEMA – Public AI Investment Committee

**"Four AI agents walk into a debate. One treasury, One outcome, All on-chain."**

Bema is a groundbreaking Web3 application where four distinct AI agents—Bull, Bear, Risk Manager, and Quant—publicly debate every treasury decision, vote by majority, and automatically execute the trade on the Arc blockchain using USDC. The product is the debate. The proof is the transaction.

This repository contains the complete, production-ready codebase for the Conviction platform, built for the Agora Agents Hackathon.

---

## 📖 Table of Contents

1. [Project Vision & Philosophy](#-project-vision--philosophy)
2. [Core Features](#-core-features)
3. [Architecture Overview](#-architecture-overview)
4. [Technology Stack](#-technology-stack)
5. [Prerequisites & Environment Setup](#-prerequisites--environment-setup)
6. [Installation Guide](#-installation-guide)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Smart Contract (Optional)](#smart-contract-optional)
7. [Configuration](#-configuration)
    - [Environment Variables](#environment-variables)
    - [Circle Payments Integration](#circle-payments-integration)
8. [Running the Application](#-running-the-application)
9. [User Guide & Demo Script](#-user-guide--demo-script)
10. [API Documentation](#-api-documentation)
11. [Project Structure](#-project-structure)
12. [Troubleshooting & Common Issues](#-troubleshooting--common-issues)
13. [Deployment Guide](#-deployment-guide)
14. [Hackathon Submission Checklist](#-hackathon-submission-checklist)
15. [Future Roadmap](#-future-roadmap)
16. [Credits & License](#-credits--license)

---

## 🎯 Project Vision & Philosophy

In traditional DeFi, users only see the outcome of a trade—a price movement, a wallet transaction, a profit or loss. **No one shows you WHY a decision was made.**

Bema makes the **reasoning public, permanent, and entertaining**. Every allocation decision comes with a full debate transcript, a vote record, and an on-chain transaction hash. Accountability is the feature.

**The unforgettable interaction:** Watching four AI agents publicly argue before executing treasury decisions on-chain. That alone carries the entire experience.

---

## ✨ Core Features

### AI Agent Senate
- **4 Distinct Agents with Fixed Personalities:**
    - 🟢 **APOLLO (The Bull):** Optimistic, momentum-driven. Finds reasons to buy.
    - 🔴 **CASSANDRA (The Bear):** Skeptical, contrarian. Finds reasons to wait or sell.
    - 🟡 **SENTINEL (Risk Manager):** Conservative, loss-averse. Protects the treasury.
    - 🔵 **ORACLE (The Quant):** Data-only, emotionless. Reads signals, no opinion.

### Live 3D Senate Chamber
- Real-time 3D environment with floating marble pedestals
- Reactive lighting and particle auroras that respond to who is speaking
- Animated agent icons and dynamic camera controls

### Real-Time Debate Streaming
- Server-Sent Events (SSE) for live debate streaming
- Sequential agent responses (Oracle → Apollo → Cassandra → Sentinel → Vote)
- Streaming text with character-by-character feel

### Treasury & Execution
- Starting balance: $10 USDC on Arc testnet
- Majority vote determines action (BUY / HOLD / REDUCE)
- Automatic on-chain execution via Arc blockchain
- Transaction hash displayed with Arc explorer link

### Custom Motions (Paid)
- Users can submit their own debate questions for $0.50 USDC
- Circle payment integration for real payment processing
- Agents specifically answer the user's custom question

### Polish & User Experience
- Collapsible controls panel with floating "OPEN CONTROLS" button
- Toggleable transcript panel that auto-opens during debates
- Live spectator counter (fluctuates 12-80+ viewers)
- Treasury roll animation (slot-machine style number changes)
- Gavel sound effect on vote decisions
- Confetti cannon on BUY decisions
- Share debate to X (Twitter) button
- Mobile-responsive design (desktop-first with mobile fallback)

---

## 🏗 Architecture Overview

┌─────────────────────────────────────────────────────────────────┐
│ USER BROWSER │
│ (React + Three.js + Tailwind) │
└───────────────────────────────┬─────────────────────────────────┘
│
│ HTTP / SSE
▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express.js) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Agents │ │ Debate │ │ Payment │ │
│ │ (Claude/ │ │ Orchest- │ │ (Circle) │ │
│ │ Mock) │ │ rator │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
│
│ Blockchain TX
▼
┌─────────────────────────────────────────────────────────────────┐
│ ARC BLOCKCHAIN (L1) │
│ USDC Treasury + Execution │
└─────────────────────────────────────────────────────────────────┘


### Data Flow
1. User clicks "START DEBATE" or submits a custom motion
2. Backend initializes a debate session
3. Each agent is called sequentially (Oracle → Apollo → Cassandra → Sentinel)
4. Market data is fetched (or mocked) and passed to each agent
5. Votes are tallied and a decision is made by majority
6. Treasury executes the decision on Arc (mock or real)
7. Frontend streams the debate live via SSE
8. Transaction hash is displayed and clickable

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | UI framework and build tool |
| **3D Graphics** | Three.js + React Three Fiber + Drei | 3D Senate chamber and animations |
| **Animations** | Framer Motion | Smooth UI transitions and micro-interactions |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Backend** | Node.js + Express | API server and debate orchestration |
| **AI** | Anthropic Claude API (or Mock) | Agent reasoning and debate generation |
| **Real-time** | Server-Sent Events (SSE) | Live debate streaming |
| **Blockchain** | Arc L1 + Viem | Treasury and transaction execution |
| **Payments** | Circle API | Custom motion payments ($0.50 USDC) |
| **HTTP Client** | Axios | API requests |
| **Deployment** | Vercel (Frontend) + Render (Backend) | Hosting |

---

## 📋 Prerequisites & Environment Setup

### Required Software
- **Node.js:** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm:** v9.0.0 or higher (comes with Node.js)
- **Git:** For version control ([Download](https://git-scm.com/))
- **PowerShell / Terminal:** For running commands
- **Modern Browser:** Chrome, Edge, or Firefox (WebGL required for 3D)

### Optional (For Full Features)
- **Anthropic API Key:** For real AI agent debates ([Get Key](https://console.anthropic.com/))
- **Circle Account:** For real payment processing ([Sign Up](https://app.circle.com/))
- **Arc Wallet:** For real on-chain execution ([Arc Docs](https://arc.finance/))

---

## 🔧 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/conviction.git
cd conviction

2. Backend Setup
bash
cd backend
npm install
What gets installed:

express – Web server

cors – Cross-origin requests

dotenv – Environment variables

@anthropic-ai/sdk – Claude API (agents)

axios – HTTP requests (market data)

viem – Arc blockchain interaction

node-cache – Cache market data

3. Frontend Setup
bash
cd ../frontend
npm install
What gets installed:

react + react-dom – UI framework

three + @react-three/fiber + @react-three/drei – 3D graphics

framer-motion – Animations

axios – API calls

tailwindcss + @tailwindcss/vite – Styling

vite – Build tool

4. Smart Contract (Optional - For Real Arc Integration)
bash
cd ../contracts
# Install Foundry or Hardhat based on Arc docs
# Deploy ConvictionTreasury.sol to Arc testnet
⚙ Configuration
Environment Variables
Backend (backend/.env)
env
# Required - AI Provider
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Get from https://console.anthropic.com/

# Required - Server
PORT=3001

# Optional - Arc Blockchain (for real execution)
ARC_RPC_URL=https://rpc.arc.finance
TREASURY_PRIVATE_KEY=0x...
TREASURY_ADDRESS=0x...
USDC_ADDRESS=0x...
PAYMASTER_ADDRESS=0x...

# Optional - Circle Payments (for real payments)
CIRCLE_API_KEY=QVBJX0tFWV9...
CIRCLE_API_BASE=https://api.circle.com/v1
CIRCLE_WALLET_ID=your_wallet_id

# Optional - Market Data (free tier works without)
COINGECKO_API_KEY=
Frontend (frontend/.env)
env
# Optional - Circle Payments
VITE_CIRCLE_CLIENT_KEY=Q0xJRU5UX0tFWV9...
VITE_CIRCLE_APP_ID=your_app_id
Circle Payments Integration (For Real Custom Motions)
Create API Key (Backend)

Go to Circle Console

Create API Key with "Circle Wallets" product

Copy to backend/.env as CIRCLE_API_KEY

Create Client Key (Frontend)

Create Client Key with "Modular Wallets" product

Set allowed domain: localhost

Copy to frontend/.env as VITE_CIRCLE_CLIENT_KEY

No Keys? The app falls back to demo mode with simulated payments

🚀 Running the Application
Development Mode
Terminal 1 – Backend:

bash
cd backend
npm run dev
# or
node server.js
Expected output:

text
🚀 Conviction backend running on port 3001
   Health: http://localhost:3001/api/health
   Treasury: http://localhost:3001/api/treasury/balance
   Payment endpoint: POST /api/payment/create
   Custom debate: POST /api/debate/custom
Terminal 2 – Frontend:

bash
cd frontend
npm run dev
Expected output:

text
VITE v5.4.21 ready in 1271 ms
➜ Local: http://localhost:3000/
Production Build
Backend:

bash
cd backend
npm start
Frontend:

bash
cd frontend
npm run build
# Output in `dist/` folder – ready for deployment
Open Application
Navigate to: http://localhost:3000

📖 User Guide & Demo Script
30-Second Quick Start
Open http://localhost:3000

Click BTC, ETH, or SOL to select asset

Click 🎭 START DEBATE

Watch 4 agents debate in real time

See vote tally and decision

Transaction hash appears with Arc explorer link

Custom Motion (Paid)
Type a question in the input field (e.g., "Should I buy SOL right now?")

Click 💰 SUBMIT

Payment modal appears → Click Pay $0.50 USDC

Processing (1.5 sec) → Debate starts with agents answering YOUR question

Controls Panel
Close Controls: Click ✕ button → collapses to "OPEN CONTROLS" bubble

Reopen Controls: Click "OPEN CONTROLS" bubble

Share Debate: Click 🐦 SHARE DEBATE on right side

Toggle Transcript: Click 💬 bubble or ✕ on transcript panel

Demo Script (3 Minutes for Judges)
Time	Action
0:00-0:20	"This is CONVICTION. Four AI agents debate every treasury decision. Treasury: $10 USDC on Arc."
0:20-1:30	Click START DEBATE. Watch Oracle, Apollo, Cassandra, Sentinel debate Bitcoin.
1:30-2:00	Vote tally appears. Decision executes. Confetti + gavel sound on BUY.
2:00-2:30	Click transaction hash → Arc explorer opens.
2:30-3:00	"Every trade has a reason. CONVICTION puts that reason on-chain, permanently."
📡 API Documentation
Endpoints
GET /api/health
Health check endpoint.
Response: {"status":"ok","timestamp":"..."}

GET /api/treasury/balance
Get current treasury balance.
Response: {"balance":10,"currency":"USDC"}

GET /api/debate/history
Get last 5 debate results.
Response: [{"debateId":"...","asset":"BTC","decision":"BUY",...}]

POST /api/debate/start
Start a free debate.
Body: {"asset":"BTC","amount":2000,"customQuestion":"..."}
Response: {"debateId":"...","debate":{...}}

POST /api/payment/create
Create payment intent for custom motion.
Body: {"question":"Should I buy SOL?"}
Response: {"success":true,"paymentIntentId":"pi_...","clientSecret":"..."}

POST /api/debate/custom
Start a paid custom debate.
Body: {"question":"...","paymentIntentId":"pi_...","amount":2000}
Response: {"debateId":"...","debate":{...},"paid":true}

GET /api/debate/stream/:debateId
Server-Sent Events stream for live debate.
Event Types:

type: "step" – New agent message

type: "complete" – Debate finished with final decision

📁 Project Structure
text
conviction/
├── backend/
│   ├── agents/
│   │   ├── apollo.js          # Bull agent (Claude API)
│   │   ├── cassandra.js       # Bear agent (Claude API)
│   │   ├── sentinel.js        # Risk agent (Claude API)
│   │   └── oracle.js          # Quant agent (market data)
│   ├── contracts/             # Smart contract files (optional)
│   ├── debate-orchestrator.js # Main debate logic
│   ├── market-data.js         # CoinGecko + Binance API
│   ├── payment.js             # Circle payment integration
│   ├── server.js              # Express API server
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── gavel.mp3          # Optional local sound file
│   ├── src/
│   │   ├── components/
│   │   │   ├── SenateChamber.jsx       # 3D scene with pedestals
│   │   │   ├── TreasuryAltar.jsx       # Treasury display with roll animation
│   │   │   ├── VoteScales.jsx          # Vote tally with animated bars
│   │   │   ├── Controls.jsx            # Asset selector + start debate
│   │   │   └── DebateTranscript3D.jsx  # Live debate transcript
│   │   ├── App.jsx            # Main application
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles + Tailwind v4
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
│
├── contracts/
│   └── ConvictionTreasury.sol # Arc treasury smart contract
│
├── .gitignore
└── README.md                  # This file
🔧 Troubleshooting & Common Issues
Issue: "Failed to load resource: 404"
Solution: Backend not running. Start backend with node server.js in backend/ folder.

Issue: "API Key loaded? false"
Solution: Missing or incorrect ANTHROPIC_API_KEY in backend/.env. Add your key and restart.

Issue: "model: claude-3-sonnet not found"
Solution: Update model name in agent files to claude-3-5-sonnet-latest or claude-3-haiku-20240307.

Issue: 3D scene is black / missing
Solution: WebGL required. Use Chrome or Edge. Update graphics drivers.

Issue: Transcript not showing
Solution: Debate must be active. Click START DEBATE first. Transcript auto-opens.

Issue: Sound not playing
Solution: Browser may block autoplay. Click anywhere on page first. Or use local /gavel.mp3 file.

Issue: Payment modal doesn't appear
Solution: Circle keys not configured. App falls back to demo mode. Check browser console for errors.

Issue: Text input not visible
Solution: Fixed in Tailwind v4. Input has text-white and placeholder-white/40 classes.

Issue: Port 3001 already in use
Solution: Change PORT in backend/.env to 3002, update BACKEND_URL in App.jsx.

Quick Diagnostic Commands
bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check backend logs
cd backend && node server.js

# Check frontend build
cd frontend && npm run build

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
🚢 Deployment Guide
Deploy Backend to Render (Free)
Push code to GitHub:

bash
git init
git add .
git commit -m "Conviction: AI debating treasury"
git remote add origin https://github.com/yourusername/conviction.git
git push -u origin main
Go to Render.com

Click "New +" → "Web Service"

Connect your GitHub repository

Configure:

Name: conviction-backend

Environment: Node

Build Command: cd backend && npm install

Start Command: cd backend && node server.js

Add environment variables from backend/.env

Click "Create Web Service"

Deploy Frontend to Vercel (Free)
Install Vercel CLI:

bash
npm i -g vercel
cd frontend
vercel
Or connect GitHub:

Go to Vercel.com

Click "Add New" → "Project"

Import your GitHub repository

Framework Preset: Vite

Root Directory: frontend

Click "Deploy"

Update BACKEND_URL in App.jsx to your Render URL:

javascript
const BACKEND_URL = 'https://conviction-backend.onrender.com';
Deploy Smart Contract to Arc (Optional)
bash
cd contracts
# Follow Arc documentation for deployment
# arc deploy ConvictionTreasury.sol --network testnet
