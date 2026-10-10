import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Flame,
  Zap,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { SCRIPT_LINES, PRODUCT_SPECS } from '../data/commercialData';

interface ReelPreviewProps {
  currentTime: number;
  duration: number;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  voiceName: string;
}

export const ReelPreview: React.FC<ReelPreviewProps> = ({
  currentTime,
  duration,
  isPlaying,
  onPlayToggle,
  voiceName,
}) => {
  const [platform, setPlatform] = useState<'tiktok' | 'instagram' | 'daraz'>('daraz');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(14200);

  // Find active line based on currentTime
  const activeLine = SCRIPT_LINES.find(
    (line) => currentTime >= line.startTime && currentTime < line.endTime
  ) || SCRIPT_LINES[0];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / (duration || 19)) * 100) : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Platform Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setPlatform('daraz')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            platform === 'daraz'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Daraz Mall Ad</span>
        </button>

        <button
          onClick={() => setPlatform('tiktok')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            platform === 'tiktok'
              ? 'bg-rose-500 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" />
          <span>TikTok Reel</span>
        </button>

        <button
          onClick={() => setPlatform('instagram')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            platform === 'instagram'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instagram Reel</span>
        </button>
      </div>

      {/* 9:16 Vertical Phone Simulator */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-[40px] p-3 bg-slate-950 border-[6px] border-slate-800 shadow-2xl shadow-amber-500/10 overflow-hidden group select-none">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-between px-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-indigo-500/80"></div>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div
          onClick={onPlayToggle}
          className="relative w-full h-full rounded-[30px] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-stone-950 flex flex-col justify-between cursor-pointer"
        >
          {/* Top Progress Bar */}
          <div className="absolute top-2 left-3 right-3 h-1 bg-white/20 rounded-full overflow-hidden z-30">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-amber-400 rounded-full transition-all duration-100 shadow-xs shadow-amber-400"
            />
          </div>

          {/* Top Header Overlay */}
          <div className="pt-6 px-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[11px] font-extrabold tracking-wider text-white bg-rose-600/90 px-2 py-0.5 rounded-md uppercase">
                {platform === 'daraz' ? 'Daraz Official' : 'Sponsored'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-amber-300 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentTime.toFixed(1)}s / 19.0s</span>
            </div>
          </div>

          {/* Product Centerpiece Visual Simulation */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-4 my-auto z-10">
            {/* Background Studio Glow */}
            <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-emerald-500/15 blur-3xl pointer-events-none"></div>

            {/* Steam Animation Elements */}
            <div className="absolute -top-4 flex items-center justify-center gap-3 w-32 pointer-events-none">
              <div className="w-2.5 h-10 bg-gradient-to-t from-white/40 to-transparent rounded-full filter blur-[2px] animate-steam-1"></div>
              <div className="w-3 h-12 bg-gradient-to-t from-white/50 to-transparent rounded-full filter blur-[2px] animate-steam-2"></div>
              <div className="w-2 h-9 bg-gradient-to-t from-white/35 to-transparent rounded-full filter blur-[2px] animate-steam-3"></div>
            </div>

            {/* Stylized 3D-Look Electric Lunch Box */}
            <div className="relative w-56 h-48 bg-gradient-to-b from-emerald-100 via-teal-50 to-slate-200 rounded-3xl p-3 shadow-2xl shadow-emerald-950/60 border-2 border-emerald-300/40 flex flex-col justify-between transform transition-transform group-hover:scale-105 duration-300">
              {/* Carry Handle */}
              <div className="w-28 h-5 mx-auto -mt-6 bg-emerald-600 rounded-t-xl border border-emerald-400/50 flex items-center justify-center shadow-md">
                <div className="w-16 h-1.5 bg-emerald-300/40 rounded-full"></div>
              </div>

              {/* Top Lid with Steam Vent Valve */}
              <div className="bg-emerald-700/90 text-white rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-bold shadow-xs">
                <span className="tracking-wide">D-KART ELECTRIC TIFFIN</span>
                <div className="flex items-center gap-1 text-amber-300">
                  <Flame className="w-3 h-3 animate-pulse text-amber-400" />
                  <span className="text-[9px]">40W HEATING</span>
                </div>
              </div>

              {/* Stainless Steel Tray Inner View */}
              <div className="bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-xl p-2 border border-slate-400/60 shadow-inner flex items-center justify-between gap-1.5">
                {/* Rice compartment */}
                <div className="flex-1 h-14 bg-amber-100/90 rounded-lg border border-amber-200/80 p-1 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-amber-900 leading-tight">
                    بریانی / چاول
                  </span>
                  <span className="text-[8px] text-amber-700">Piping Hot</span>
                </div>
                {/* Curry / Korma compartment */}
                <div className="w-20 h-14 bg-orange-100/90 rounded-lg border border-orange-200/80 p-1 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-orange-900 leading-tight">
                    سالن / سالاد
                  </span>
                  <span className="text-[8px] text-orange-700">Fresh Curry</span>
                </div>
              </div>

              {/* Bottom Base with 40W PTC Element Indicator & Power Socket */}
              <div className="bg-emerald-800 text-emerald-100 rounded-xl p-1.5 flex items-center justify-between text-[9px] font-semibold">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-emerald-200">PTC Heating Active</span>
                </div>
                <div className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded text-[8px] text-amber-300 font-mono">
                  <Zap className="w-2.5 h-2.5" />
                  <span>220V / 12V</span>
                </div>
              </div>
            </div>

            {/* Feature Floating Badges */}
            <div className="w-full flex items-center justify-between gap-2 mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-emerald-300 font-semibold shadow-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>304 Stainless Steel</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-amber-300 font-semibold shadow-xs">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>چالیس واٹ ہیٹنگ (40W)</span>
              </div>
            </div>
          </div>

          {/* Social Right Bar (TikTok / Reels style) */}
          <div className="absolute right-2.5 bottom-28 flex flex-col items-center gap-4 z-20">
            {/* D-Kart Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                DK
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                +
              </div>
            </div>

            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 text-white cursor-pointer active:scale-125 transition-transform"
            >
              <div className={`p-2 rounded-full ${isLiked ? 'text-rose-500' : 'text-white'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </div>
              <span className="text-[10px] font-bold">{(likeCount / 1000).toFixed(1)}k</span>
            </button>

            {/* Comments */}
            <div className="flex flex-col items-center gap-0.5 text-white">
              <div className="p-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">894</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-0.5 text-white">
              <div className="p-2">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Share</span>
            </div>

            {/* Rotating Sound Disc */}
            <div className={`w-8 h-8 rounded-full bg-slate-800 border border-white/20 p-1 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
              <div className="w-full h-full rounded-full bg-amber-500/80 flex items-center justify-center">
                <Music2 className="w-3.5 h-3.5 text-slate-950" />
              </div>
            </div>
          </div>

          {/* Bottom Captions & E-Commerce CTA Overlay */}
          <div className="p-4 pt-2 bg-gradient-to-t from-black via-black/85 to-transparent z-20 space-y-2.5">
            {/* Merchant handle & audio tag */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">@DKartOfficial</span>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                الیکٹرک لنچ باکس 40W • دفتر اور سفر میں کھانا گرم رکھنے کی سہولت
              </p>
            </div>

            {/* Live Urdu Karaoke Subtitle Box */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-2.5 shadow-lg text-right">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 mb-1 text-[9px]">
                <span className="text-amber-400 font-mono font-medium flex items-center gap-1">
                  <Volume2 className="w-2.5 h-2.5" />
                  Voice: {voiceName} ({activeLine.role})
                </span>
                <span className="text-slate-400 font-mono">
                  {activeLine.startTime.toFixed(1)}s - {activeLine.endTime.toFixed(1)}s
                </span>
              </div>

              {/* Large Styled Urdu Line */}
              <p className="text-base sm:text-lg font-bold font-urdu text-amber-300 leading-relaxed text-right drop-shadow-md">
                {activeLine.urdu}
              </p>

              {/* Roman / English Subtext */}
              <p className="text-[10px] text-slate-400 text-left font-sans italic line-clamp-1 mt-0.5">
                {activeLine.english}
              </p>
            </div>

            {/* E-Commerce Buy Bar */}
            <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-900 font-black">
                  ڈی کارٹ ڈسکاؤنٹ آفر
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-slate-950">Rs. 2,999</span>
                  <span className="text-[10px] line-through text-slate-800/80">Rs. 4,999</span>
                  <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">
                    -40%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 text-white rounded-lg text-xs font-black shadow-sm group-hover:bg-slate-900 transition-colors">
                <span>آرڈر کریں</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
