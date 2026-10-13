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
    <header className="border-b border-[#23232b] bg-[#121217]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-b from-[#2a2a36] to-[#181820] border border-[#353545] flex items-center justify-center shadow-inner text-white font-mono font-bold text-base">
            <span className="text-[#8ab4f8]">D</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-[#f0f0f3] tracking-tight">
                D-Kart <span className="text-[#8ab4f8] font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-[#8ab4f8]/10 border border-[#8ab4f8]/20">Urdu Studio</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#181820] text-[#a0a0ab] border border-[#2a2a36] font-mono flex items-center gap-1">
                <span className="text-[#8ab4f8]">voice:</span>
                <span className="text-[#e2e2e8]">{voiceName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center / Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#181820] border border-[#262632] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#80808e] font-mono text-[11px]">engine:</span>
            <code className="text-[#e6e6ec] font-mono text-[11px] bg-[#22222c] px-1.5 py-0.5 rounded border border-[#2f2f3d]">
              {modelName}
            </code>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181820] border border-[#262632] text-xs text-[#a0a0ab] font-mono">
            <Radio className="w-3.5 h-3.5 text-[#8ab4f8] animate-pulse" />
            <span>24kHz WAV</span>
          </div>
        </div>
      </div>
    </header>
  );
};

