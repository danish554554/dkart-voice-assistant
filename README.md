# D-Kart Pakistani Urdu Voice-Over Commercial Studio 🎙️

An interactive 19-second commercial voice-over and vertical reel production studio powered by **Google Gemini 3.8 Flash TTS** for the **Electric Lunch Box Food Warmer (40W)**.

Featuring 5 native Pakistani female voice artists (Karachi, Lahore, Islamabad, Influencer, FM Radio) and real-time audio synchronization with Daraz, TikTok, and Instagram vertical reels.

---

## 🚀 Quick Start in VS Code (Local Setup)

### 1. Prerequisites
- **Node.js**: v18 or later (Node 20+ recommended)
- **npm** or **pnpm**
- **Google Gemini API Key**: Get a free or paid key from [Google AI Studio](https://aistudio.google.com/).

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Your Gemini API Key from Google AI Studio
GEMINI_API_KEY="AIzaSy..."

# Port (Optional, defaults to 3000)
PORT=3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐙 How to Upload to GitHub

In your project root in VS Code or Terminal, run:

```bash
# Initialize git repository
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: D-Kart Urdu Commercial Studio"

# Set main branch
git branch -M main

# Add your GitHub repository remote URL (replace with your repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push to GitHub
git push -u origin main
```

---

## 🟣 How to Deploy on Render (Free Web Service)

1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `dkart-urdu-studio`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY` = *your Google Gemini API Key*
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**.
7. Render will build and host your full-stack app on a live URL like `https://dkart-urdu-studio.onrender.com`.

---

## ▲ How to Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: *your Google Gemini API Key*
6. Click **Deploy**.
7. Vercel automatically deploys the frontend static assets and serverless functions in `/api/tts.ts` via the included `vercel.json`.

---

## 📁 Project Structure

```
├── api/
│   ├── tts.ts            # Vercel serverless function for /api/tts
│   └── health.ts         # Vercel serverless function for /api/health
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Header with model & active voice badges
│   │   ├── AudioPlayer.tsx       # Waveform visualizer, player, .WAV export
│   │   ├── ReelPreview.tsx       # 9:16 vertical Daraz/TikTok mockup with live subtitles
│   │   ├── ScriptSection.tsx     # Voice personas, model switcher, Nastaliq editor
│   │   ├── TimelineBreakdown.tsx # 19-second commercial storyboard
│   │   └── SpecsSection.tsx      # 40W Electric Lunch Box specifications
│   ├── data/
│   │   └── commercialData.ts     # Urdu script, voice profiles & product data
│   ├── App.tsx           # Main application layout & audio orchestration
│   ├── index.css         # Tailwind utilities & animations
│   ├── main.tsx          # React DOM entry point
│   └── types.ts          # TypeScript type definitions
├── server.ts             # Express full-stack server (Local & Render deployment)
├── vercel.json           # Vercel deployment rewrites
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🎙️ Spoken Urdu Commercial Script (19 Seconds)

> **"اب دفتر ہو یا سفر، کھانا رہے گرم اور تازہ!  
> پیش ہے الیکٹرک لنچ باکس، جس میں ہے اسٹین لیس اسٹیل کنٹینر اور چالیس واٹ کی ہیٹنگ۔  
> بس پاور سے کنیکٹ کریں اور اپنے کھانے کو گرم کرنے کی سہولت پائیں۔  
> آج ہی آرڈر کریں ڈی کارٹ سے!"**

### Pronunciation Safeguards:
- **40W**: pronounced strictly as **"چالیس واٹ"** (*Chalis Watt*).
- **D-Kart**: pronounced strictly as **"ڈی کارٹ"** (*Dee-Kart*).
- **Audio Output**: Clean studio-quality 24kHz unary WAV with no background noise or music.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Noto Nastaliq Urdu Typography
- **Speech AI**: `@google/genai` with `gemini-3.8-flash-tts` & `gemini-3.8-flash-lite-tts`
- **Audio Delivery**: 24kHz Unary PCM WAV RIFF
- **Backend**: Express (Local & Render) / Vercel Serverless Functions (Vercel)
