import React from 'react';
import { Volume2, Sparkles, Mic, ShoppingBag, Radio } from 'lucide-react';

interface NavbarProps {
  onQuickGenerate: () => void;
  isGenerating: boolean;
  modelName: string;
  voiceName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onQuickGenerate,
  isGenerating,
  modelName,
  voiceName = 'Kore',
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black text-xl">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                D-Kart <span className="text-amber-400">Urdu Studio</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                <span>Female Voice: {voiceName}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Electric Lunch Box 40W • Pakistani Urdu Commercial
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">TTS Engine:</span>
            <code className="text-amber-400 font-mono text-[11px] bg-slate-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
              {modelName}
            </code>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-orange-400" />
            <span>24kHz Studio RIFF WAV</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Recording Voice-Over...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Generate Voice-Over</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
