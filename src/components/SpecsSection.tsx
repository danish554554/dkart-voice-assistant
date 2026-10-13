import React from 'react';
import {
  ShieldCheck,
  Radio,
  Sliders,
  CheckCircle,
  FileCheck,
  Sparkles,
  Volume2,
  Headphones,
  Gauge,
  Layers,
} from 'lucide-react';

export const SpecsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Studio Audio Standards Overview */}
      <div className="lg:col-span-2 bg-[#181820] border border-[#2b2b3c] rounded-2xl p-5 shadow-xl space-y-4 text-[#e2e2e8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#252535]">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#8ab4f8]" />
            <h3 className="font-bold text-[#f2f2f8] text-base font-mono">
              Universal Urdu Audio Production Specifications
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#20202e] text-[#8ab4f8] border border-[#323245] font-semibold">
            BROADCAST STANDARD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22222f] border border-[#303042] flex items-center justify-center text-[#8ab4f8] shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#808092] block text-[11px] font-mono">Audio Fidelity</span>
              <strong className="text-white text-xs sm:text-sm">
                24kHz / 16-Bit Studio WAV
              </strong>
              <p className="text-[#757585] text-[10px] mt-0.5">
                Clean, uncompressed PCM unary broadcast sound without background hiss or compression artifacts.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22222f] border border-[#303042] flex items-center justify-center text-[#8ab4f8] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#808092] block text-[11px] font-mono">Phonetic & Diction Model</span>
              <strong className="text-white text-xs sm:text-sm">
                Native Pakistani Accents
              </strong>
              <p className="text-[#757585] text-[10px] mt-0.5">
                Standardized Urdu Nastaliq pronunciations for Karachi, Lahore, and Islamabad commercial delivery.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22222f] border border-[#303042] flex items-center justify-center text-[#8ab4f8] shrink-0">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#808092] block text-[11px] font-mono">Dynamic Speed Engine</span>
              <strong className="text-white text-xs sm:text-sm">
                0.5x – 2.0x Pitch-Preserved
              </strong>
              <p className="text-[#757585] text-[10px] mt-0.5">
                Web Audio DSP resamples exact sample rate headers so downloaded files maintain natural vocal timbre.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22222f] border border-[#303042] flex items-center justify-center text-[#8ab4f8] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#808092] block text-[11px] font-mono">Platform Compatibility</span>
              <strong className="text-white text-xs sm:text-sm">
                Vertical 9:16 & Broadcast 16:9
              </strong>
              <p className="text-[#757585] text-[10px] mt-0.5">
                Precision cut-outs optimized for TikTok ads, Daraz live streaming, Instagram Reels, and YouTube shorts.
              </p>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="pt-2 border-t border-[#252535]">
          <h4 className="text-xs font-mono font-bold text-[#8ab4f8] uppercase tracking-wider mb-2">
            Commercial Studio Capabilities:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a0a0b2]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#8ab4f8] shrink-0" />
              <span>Universal script support for any e-commerce product or brand campaign</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#8ab4f8] shrink-0" />
              <span>Urdu pause markers (، اور ۔) automatically parsed into natural breathing breaks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#8ab4f8] shrink-0" />
              <span>Multi-artist selection: Ayesha, Zainab, Fatima, Mahnoor, and Hira</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#8ab4f8] shrink-0" />
              <span>Direct high-fidelity WAV file downloads ready for Premier Pro and CapCut</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Commercial Compliance & Quality Control */}
      <div className="bg-[#181820] border border-[#2b2b3c] rounded-2xl p-5 shadow-xl space-y-4 text-[#e2e2e8]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#252535]">
          <FileCheck className="w-5 h-5 text-[#8ab4f8]" />
          <h3 className="font-bold text-[#f2f2f8] text-base font-mono">
            Audio Delivery Checklist & QC
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">Target Language</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-[#8ab4f8] border border-[#2e2e42] font-bold">
              Pakistani Urdu (اردو)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">Script Scope</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-white border border-[#2e2e42] font-semibold">
              Universal / Any Product
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">Pacing Standard</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-[#8ab4f8] border border-[#2e2e42] font-mono font-bold">
              15s – 60s Social Reels
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">TTS Synthesis Engine</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-[#8ab4f8] border border-[#2e2e42] font-mono font-bold">
              Google Gemini 3.8
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">Audio Channel</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-white border border-[#2e2e42] font-semibold">
              Studio Clean (Isolated Voice)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#14141c] border border-[#252535] flex items-center justify-between">
            <span className="text-[#808092] font-mono">Master Output</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1e2b] text-[#8ab4f8] border border-[#2e2e42] font-mono text-[11px]">
              24kHz WAV Uncompressed
            </span>
          </div>
        </div>

        {/* Commercial Callout */}
        <div className="p-3 rounded-xl bg-[#14141c] border border-[#252535] text-[11px] text-[#808092]">
          <p className="font-semibold text-white font-mono">Ready for Ad & Video Deployment:</p>
          <p className="text-[#757588] mt-0.5">
            Compatible with all video editors and ad platforms including Daraz Mall, TikTok Ads Manager, Meta Reels, and YouTube commercials.
          </p>
        </div>
      </div>
    </div>
  );
};

