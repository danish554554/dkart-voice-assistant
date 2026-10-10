import React from 'react';
import { Clock, Zap, Flame, Shield, ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { SCRIPT_LINES } from '../data/commercialData';

interface TimelineBreakdownProps {
  currentTime: number;
  onSeek: (time: number) => void;
}

export const TimelineBreakdown: React.FC<TimelineBreakdownProps> = ({
  currentTime,
  onSeek,
}) => {
  const acts = [
    {
      act: 1,
      name: 'Hook / Attention Grabber',
      timeRange: '0:00 - 0:04.5',
      seconds: 4.5,
      start: 0,
      energy: 'High & Engaging',
      pitch: 'Upbeat problem-solver',
      visualCue: 'Cold office desk lunchbox vs. warm steaming fresh meal',
      urduSummary: 'اب دفتر ہو یا سفر، کھانا رہے گرم اور تازہ!',
      tagColor: 'from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-500/30',
    },
    {
      act: 2,
      name: 'Product Reveal & Core Specs',
      timeRange: '0:04.5 - 0:10.5',
      seconds: 6.0,
      start: 4.5,
      energy: 'Articulate & Confident',
      pitch: 'Clear technical punch: 40W & 304 Steel',
      visualCue: 'Unbox 304 stainless steel tray, steam rising, 40W heating coil',
      urduSummary: 'پیش ہے الیکٹرک لنچ باکس، جس میں ہے اسٹین لیس اسٹیل کنٹینر اور چالیس واٹ کی ہیٹنگ۔',
      tagColor: 'from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      act: 3,
      name: 'Convenience & Lifestyle Benefit',
      timeRange: '0:10.5 - 0:15.0',
      seconds: 4.5,
      start: 10.5,
      energy: 'Friendly & Reassuring',
      pitch: 'Effortless routine without microwaves',
      visualCue: 'Plug into office 220V wall or car 12V socket, ready in minutes',
      urduSummary: 'بس پاور سے کنیکٹ کریں اور اپنے کھانے کو گرم کرنے کی سہولت پائیں۔',
      tagColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      act: 4,
      name: 'Urgent Call-To-Action (CTA)',
      timeRange: '0:15.0 - 0:19.0',
      seconds: 4.0,
      start: 15.0,
      energy: 'Punched & Persuasive',
      pitch: 'Authoritative e-commerce closing',
      visualCue: 'D-Kart branded checkout graphic, 40% discount, fast delivery badge',
      urduSummary: 'آج ہی آرڈر کریں ڈی کارٹ سے!',
      tagColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              19-Second Commercial Reel Storyboard & Timing
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineered for optimum retention on Daraz, TikTok, and Meta Reels algorithms
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-400">Total Run Time:</span>
          <span className="text-amber-400 font-bold">19.00s</span>
        </div>
      </div>

      {/* Grid of the 4 acts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {acts.map((act) => {
          const isActive = currentTime >= act.start && currentTime < act.start + act.seconds;
          return (
            <div
              key={act.act}
              onClick={() => onSeek(act.start)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r border ${act.tagColor}`}>
                    Act 0{act.act}
                  </span>
                  <span className="font-bold text-xs text-white">
                    {act.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                  <span>{act.timeRange}</span>
                  <PlayCircle className="w-3.5 h-3.5 text-amber-400 hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* Urdu Line */}
              <div className="py-2.5 text-right">
                <p className="text-base font-bold font-urdu text-amber-300 leading-relaxed">
                  {act.urduSummary}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">
                    Tone / Energy
                  </span>
                  <span className="text-slate-200 font-medium">
                    {act.energy}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">
                    Visual Scene Cue
                  </span>
                  <span className="text-slate-300 line-clamp-1">
                    {act.visualCue}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
