import React from 'react';
import {
  ShieldCheck,
  Flame,
  Zap,
  Box,
  Truck,
  CheckCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { PRODUCT_SPECS } from '../data/commercialData';

export const SpecsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Technical Overview */}
      <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 text-zinc-900">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-zinc-900" />
            <h3 className="font-bold text-zinc-900 text-base">
              Product Technical Specifications (Electric Lunch Box 40W)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
            SS-304 Certified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Heating Power</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                40W PTC Rapid Element
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Pronounced: <span className="text-zinc-950 font-urdu font-bold">چالیس واٹ</span> (Heats meals in 20-25 mins)
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Food Tray Container</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                304 Stainless Steel
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                اسٹین لیس اسٹیل • Rust-proof, non-toxic & dishwasher safe
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Power Input</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                Dual 220V & 12V Support
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                For Office Desks (220V) and Travel/Car (12V)
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Capacity & Sealing</span>
              <strong className="text-zinc-900 text-xs sm:text-sm">
                1.5 Liters Leak-Proof
              </strong>
              <p className="text-zinc-500 text-[10px] mt-0.5">
                Silicone gasket + 4 snap buckles with steam release valve
              </p>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="pt-2 border-t border-zinc-200">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
            Commercial Script Highlights:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
            {PRODUCT_SPECS.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Commercial Compliance & Quality Control */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 text-zinc-900">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-200">
          <FileCheck className="w-5 h-5 text-zinc-900" />
          <h3 className="font-bold text-zinc-900 text-base">
            Audio Delivery Checklist
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Language & Accent</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold">
              Pakistani Urdu
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Pacing Target</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-mono font-bold">
              ~19.0 Seconds
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">40W Pronunciation</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-950 border border-zinc-200 font-urdu font-bold">
              چالیس واٹ
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Brand Callout</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-950 border border-zinc-200 font-urdu font-bold">
              ڈی کارٹ
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Clean Studio Audio</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold">
              No BG Music / SFX
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Audio Output</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-[11px]">
              24kHz WAV Unary
            </span>
          </div>
        </div>

        {/* Commercial Callout */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700">
          <p className="font-semibold text-zinc-900">Ready for ad distribution:</p>
          <p className="text-zinc-500 mt-0.5">
            Optimized for Daraz Live, TikTok Spark Ads, Instagram Reels, and Meta E-Commerce campaigns across Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
};
