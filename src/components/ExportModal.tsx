import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Terminal,
  Github,
  Cloud,
  FileCode,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vscode' | 'github' | 'render' | 'vercel'>('vscode');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `# 1. Initialize git repository
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: D-Kart Urdu Commercial Voice-Over Studio"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git

# 6. Push code to GitHub
git push -u origin main`;

  const envSample = `# Google Gemini API Key (Required)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Port (Optional, default 3000)
PORT=3000
NODE_ENV=production`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Export & Deployment Guide
              </h3>
              <p className="text-xs text-slate-400">
                Run in VS Code • Upload to GitHub • Deploy to Render & Vercel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900 overflow-x-auto pb-3">
          <button
            onClick={() => setActiveTab('vscode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vscode'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. VS Code Local Run</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>2. Upload to GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('render')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'render'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>3. Deploy on Render</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. Deploy on Vercel</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: VS CODE */}
          {activeTab === 'vscode' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <p className="font-bold text-xs mb-1">
                  Step 1: Open project folder in VS Code
                </p>
                <p className="text-slate-300 text-[11px]">
                  Ensure you have <strong>Node.js 18+</strong> installed. Then open your terminal in the project directory.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-slate-300">Terminal commands to install and start:</span>
                  <button
                    onClick={() => copyToClipboard('npm install && npm run dev', 'vscode-cmd')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    {copiedKey === 'vscode-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vscode-cmd' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`# Install all dependencies
npm install

# Start the full-stack server
npm run dev`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-slate-300">Create `.env` file in the root folder:</span>
                  <button
                    onClick={() => copyToClipboard(envSample, 'env-sample')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    {copiedKey === 'env-sample' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'env-sample' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
{envSample}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-[11px]">
                Create a new empty repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-amber-400 underline">GitHub.com</a>, then run these commands in VS Code terminal:
              </p>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-slate-300">Git push commands:</span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git-cmd')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    {copiedKey === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'git-cmd' ? 'Copied Commands' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
{gitCommands}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: RENDER */}
          {activeTab === 'render' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold block">Render.com Web Service Setup:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>Log in to <strong className="text-white">Render.com</strong> & click <strong>New +</strong> &gt; <strong>Web Service</strong>.</li>
                  <li>Connect your GitHub repository.</li>
                  <li>Set <strong>Build Command</strong>: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">npm install && npm run build</code></li>
                  <li>Set <strong>Start Command</strong>: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">npm start</code></li>
                  <li>Add Environment Variable: <code className="bg-slate-900 px-1 py-0.5 rounded text-rose-300">GEMINI_API_KEY</code> = <em>Your Gemini API Key</em></li>
                  <li>Click <strong>Deploy Web Service</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold block">Vercel Setup (Zero Configuration):</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>This project includes <code className="text-amber-300">vercel.json</code> and <code className="text-amber-300">api/tts.ts</code> ready for Vercel.</li>
                  <li>Log in to <strong className="text-white">Vercel.com</strong> & click <strong>Add New...</strong> &gt; <strong>Project</strong>.</li>
                  <li>Import your GitHub repository.</li>
                  <li>Add Environment Variable: <code className="bg-slate-900 px-1 py-0.5 rounded text-rose-300">GEMINI_API_KEY</code></li>
                  <li>Click <strong>Deploy</strong>. Vercel will host the frontend and serverless API automatically!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            All configuration files (<code className="text-slate-300">README.md</code>, <code className="text-slate-300">vercel.json</code>, <code className="text-slate-300">server.ts</code>) are in the project root.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
