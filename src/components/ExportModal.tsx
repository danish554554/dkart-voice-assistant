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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#14141c] border border-[#252535] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#ededee]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23232f] bg-[#181820]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#22222d] border border-[#323242] flex items-center justify-center text-[#8ab4f8]">
              <FileCode className="w-5 h-5 text-[#8ab4f8]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#ededee] text-base">
                Export & Deployment Guide
              </h3>
              <p className="text-xs text-[#888896]">
                Run in VS Code • Upload to GitHub • Deploy to Render & Vercel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1e1e28] hover:bg-[#2b2b3c] text-[#888896] hover:text-[#ededee] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#23232f] bg-[#14141c] overflow-x-auto pb-3">
          <button
            onClick={() => setActiveTab('vscode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vscode'
                ? 'bg-[#22222d] text-[#8ab4f8] border border-[#323242] shadow-xs'
                : 'text-[#888896] hover:text-[#ededee] bg-[#181820]/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. VS Code Local Run</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-[#22222d] text-[#8ab4f8] border border-[#323242] shadow-xs'
                : 'text-[#888896] hover:text-[#ededee] bg-[#181820]/60'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>2. Upload to GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('render')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'render'
                ? 'bg-[#22222d] text-[#8ab4f8] border border-[#323242] shadow-xs'
                : 'text-[#888896] hover:text-[#ededee] bg-[#181820]/60'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>3. Deploy on Render</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-[#22222d] text-[#8ab4f8] border border-[#323242] shadow-xs'
                : 'text-[#888896] hover:text-[#ededee] bg-[#181820]/60'
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
              <div className="p-3 rounded-xl bg-[#181820] border border-[#252535] text-[#d0d0dc]">
                <p className="font-bold text-xs mb-1 text-[#ededee]">
                  Step 1: Open project folder in VS Code
                </p>
                <p className="text-[#888896] text-[11px]">
                  Ensure you have <strong className="text-[#ededee]">Node.js 18+</strong> installed. Then open your terminal in the project directory.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-[#ededee]">Terminal commands to install and start:</span>
                  <button
                    onClick={() => copyToClipboard('npm install && npm run dev', 'vscode-cmd')}
                    className="flex items-center gap-1 text-[11px] text-[#8ab4f8] hover:text-[#689ef7] cursor-pointer font-medium"
                  >
                    {copiedKey === 'vscode-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vscode-cmd' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#0e0e11] border border-[#23232f] font-mono text-[11px] text-[#ededee] overflow-x-auto">
{`# Install all dependencies
npm install

# Start the full-stack server
npm run dev`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-[#ededee]">Create `.env` file in the root folder:</span>
                  <button
                    onClick={() => copyToClipboard(envSample, 'env-sample')}
                    className="flex items-center gap-1 text-[11px] text-[#8ab4f8] hover:text-[#689ef7] cursor-pointer font-medium"
                  >
                    {copiedKey === 'env-sample' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'env-sample' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#0e0e11] border border-[#23232f] font-mono text-[11px] text-[#ededee] overflow-x-auto">
{envSample}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <p className="text-[#888896] text-[11px]">
                Create a new empty repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#8ab4f8] font-semibold underline">GitHub.com</a>, then run these commands in VS Code terminal:
              </p>

              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-[#ededee]">Git push commands:</span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git-cmd')}
                    className="flex items-center gap-1 text-[11px] text-[#8ab4f8] hover:text-[#689ef7] cursor-pointer font-medium"
                  >
                    {copiedKey === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'git-cmd' ? 'Copied Commands' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#0e0e11] border border-[#23232f] font-mono text-[11px] text-[#ededee] overflow-x-auto leading-relaxed">
{gitCommands}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: RENDER */}
          {activeTab === 'render' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#181820] border border-[#252535] space-y-2">
                <span className="text-[#ededee] font-bold block">Render.com Web Service Setup:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-[#d0d0dc] leading-relaxed text-[11px]">
                  <li>Log in to <strong className="text-[#ededee]">Render.com</strong> & click <strong>New +</strong> &gt; <strong>Web Service</strong>.</li>
                  <li>Connect your GitHub repository.</li>
                  <li>Set <strong>Build Command</strong>: <code className="bg-[#22222d] px-1 py-0.5 rounded text-[#8ab4f8]">npm install && npm run build</code></li>
                  <li>Set <strong>Start Command</strong>: <code className="bg-[#22222d] px-1 py-0.5 rounded text-[#8ab4f8]">npm start</code></li>
                  <li>Add Environment Variable: <code className="bg-[#22222d] px-1 py-0.5 rounded text-[#8ab4f8]">GEMINI_API_KEY</code> = <em>Your Gemini API Key</em></li>
                  <li>Click <strong>Deploy Web Service</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#181820] border border-[#252535] space-y-2">
                <span className="text-[#ededee] font-bold block">Vercel Setup (Zero Configuration):</span>
                <ol className="list-decimal list-inside space-y-1.5 text-[#d0d0dc] leading-relaxed text-[11px]">
                  <li>This project includes <code className="text-[#8ab4f8] font-semibold">vercel.json</code> and <code className="text-[#8ab4f8] font-semibold">api/tts.ts</code> ready for Vercel.</li>
                  <li>Log in to <strong className="text-[#ededee]">Vercel.com</strong> & click <strong>Add New...</strong> &gt; <strong>Project</strong>.</li>
                  <li>Import your GitHub repository.</li>
                  <li>Add Environment Variable: <code className="bg-[#22222d] px-1 py-0.5 rounded text-[#8ab4f8]">GEMINI_API_KEY</code></li>
                  <li>Click <strong>Deploy</strong>. Vercel will host the frontend and serverless API automatically!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#23232f] bg-[#181820] flex items-center justify-between">
          <span className="text-[11px] text-[#888896]">
            All configuration files (<code className="text-[#ededee]">README.md</code>, <code className="text-[#ededee]">vercel.json</code>, <code className="text-[#ededee]">server.ts</code>) are in the project root.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#22222d] hover:bg-[#2e2e3d] text-[#ededee] border border-[#323242] font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
