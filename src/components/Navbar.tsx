import React from 'react';
import { Radio } from 'lucide-react';

interface NavbarProps {
  onQuickGenerate?: () => void;
  isGenerating?: boolean;
  modelName: string;
  voiceName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelName,
  voiceName = 'Kore',
}) => {
  return (
    <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-black font-black text-xl">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                D-Kart <span className="text-zinc-400 font-medium">Urdu Studio</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-800 font-semibold flex items-center gap-1 shadow-xs">
                <span>Voice: {voiceName}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Pakistani Urdu Commercial Audio Production
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-zinc-400 font-medium">TTS Engine:</span>
            <code className="text-black font-mono text-[11px] bg-white px-1.5 py-0.5 rounded font-bold">
              {modelName}
            </code>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-medium">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>24kHz Studio WAV</span>
          </div>
        </div>
      </div>
    </header>
  );
};

