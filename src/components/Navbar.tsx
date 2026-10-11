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
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-sm text-white font-black text-xl">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
                D-Kart <span className="text-zinc-500 font-medium">Urdu Studio</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold flex items-center gap-1">
                <span>Voice: {voiceName}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Pakistani Urdu Commercial Audio Production
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            <span className="text-zinc-600 font-medium">TTS Engine:</span>
            <code className="text-zinc-900 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-zinc-300">
              {modelName}
            </code>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-700">
            <Radio className="w-3.5 h-3.5 text-zinc-900" />
            <span>24kHz Studio WAV</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Recording Voice-Over...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-white" />
                <span>Generate Voice-Over</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
