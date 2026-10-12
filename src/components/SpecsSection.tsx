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
      <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 text-zinc-900">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-zinc-900" />
            <h3 className="font-bold text-zinc-900 text-base">
              Universal Urdu Audio Production Specifications
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
            Broadcast Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Audio Fidelity</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                24kHz / 16-Bit Studio WAV
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Clean, uncompressed PCM unary broadcast sound without background hiss or compression artifacts.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Phonetic & Diction Model</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                Native Pakistani Accents
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Standardized Urdu Nastaliq pronunciations for Karachi, Lahore, and Islamabad commercial delivery.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Dynamic Speed Engine</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                0.5x – 2.0x Pitch-Preserved
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Web Audio DSP resamples exact sample rate headers so downloaded files maintain natural vocal timbre.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Platform Compatibility</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                Vertical 9:16 & Broadcast 16:9
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Precision cut-outs optimized for TikTok ads, Daraz live streaming, Instagram Reels, and YouTube shorts.
              </p>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="pt-2 border-t border-zinc-200">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
            Commercial Studio Capabilities:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Universal script support for any e-commerce product or brand campaign</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Urdu pause markers (، اور ۔) automatically parsed into natural breathing breaks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Multi-artist selection: Ayesha, Zainab, Fatima, Mahnoor, and Hira</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Direct high-fidelity WAV file downloads ready for Premier Pro and CapCut</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Commercial Compliance & Quality Control */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 text-zinc-900">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-200">
          <FileCheck className="w-5 h-5 text-zinc-900" />
          <h3 className="font-bold text-zinc-900 text-base">
            Audio Delivery Checklist & QC
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Target Language</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold">
              Pakistani Urdu (اردو)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Script Scope</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold">
              Universal / Any Product
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Pacing Standard</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-mono font-bold">
              15s – 60s Social Reels
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">TTS Synthesis Engine</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-950 border border-zinc-200 font-mono font-bold">
              Google Gemini 3.8
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Audio Channel</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold">
              Studio Clean (Isolated Voice)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Master Output</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-[11px]">
              24kHz WAV Uncompressed
            </span>
          </div>
        </div>

        {/* Commercial Callout */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700">
          <p className="font-semibold text-zinc-900">Ready for Ad & Video Deployment:</p>
          <p className="text-zinc-500 mt-0.5">
            Compatible with all video editors and ad platforms including Daraz Mall, TikTok Ads Manager, Meta Reels, and YouTube commercials.
          </p>
        </div>
      </div>
    </div>
  );
};

