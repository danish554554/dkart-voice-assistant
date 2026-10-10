import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Info,
  CheckCircle2,
  Headphones,
  Zap,
  Github,
} from 'lucide-react';
import { SCRIPT_LINES, VOICE_OPTIONS, MODEL_OPTIONS, EXACT_URDU_SCRIPT } from '../data/commercialData';
import { VoiceOption } from '../types';
import { ExportModal } from './ExportModal';

interface ScriptSectionProps {
  onGenerate: (config: {
    voice: string;
    baseVoice?: string;
    model?: string;
    style: string;
    pace: string;
    script: string;
  }) => void;
  isGenerating: boolean;
  selectedVoice: string;
  onVoiceChange: (voice: string, baseVoice?: string, defaultStyle?: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  activeLineIndex?: number;
  onLineClick?: (startTime: number) => void;
}

export const ScriptSection: React.FC<ScriptSectionProps> = ({
  onGenerate,
  isGenerating,
  selectedVoice,
  onVoiceChange,
  selectedModel,
  onModelChange,
  activeLineIndex = 0,
  onLineClick,
}) => {
  const [scriptText, setScriptText] = useState<string>(EXACT_URDU_SCRIPT);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [selectedPace, setSelectedPace] = useState<string>('Moderately Fast (~19s Reel)');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('female');

  const currentVoiceObj =
    VOICE_OPTIONS.find((v) => v.id === selectedVoice) || VOICE_OPTIONS[0];

  const [stylePreset, setStylePreset] = useState<string>(
    currentVoiceObj.sampleStyle
  );

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetScript = () => {
    setScriptText(EXACT_URDU_SCRIPT);
  };

  const handleVoiceSelect = (voice: typeof VOICE_OPTIONS[0]) => {
    onVoiceChange(voice.id, voice.baseVoice, voice.sampleStyle);
    setStylePreset(voice.sampleStyle);
  };

  const handleTriggerGenerate = () => {
    onGenerate({
      voice: currentVoiceObj.id,
      baseVoice: currentVoiceObj.baseVoice,
      model: selectedModel,
      style: stylePreset,
      pace: selectedPace,
      script: scriptText,
    });
  };

  const filteredVoices = VOICE_OPTIONS.filter((v) => {
    if (genderFilter === 'female') return v.gender === 'female';
    if (genderFilter === 'male') return v.gender === 'male';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Voice Selection & Style Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Model & Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Voice Artists & Models (Pakistani Urdu Accent)
              </h3>
              <p className="text-xs text-slate-400">
                Choose from 5 distinct Pakistani female commercial voices or switch TTS models
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Model Switcher */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {MODEL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onModelChange(m.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                    selectedModel === m.id
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={m.description}
                >
                  <span>{m.name.replace('Gemini ', '')}</span>
                  <span className="ml-1 text-[9px] opacity-75 font-mono">({m.badge})</span>
                </button>
              ))}
            </div>

            {/* Pace */}
            <select
              value={selectedPace}
              onChange={(e) => setSelectedPace(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-medium focus:outline-hidden focus:border-amber-500"
            >
              <option value="Moderately Fast (~19s Reel)">Moderately Fast (19s Reel Standard)</option>
              <option value="Fast & Viral (~16s TikTok)">Fast & Viral (16s TikTok)</option>
              <option value="Steady Commercial (~21s)">Steady Commercial (21s Meta Ad)</option>
            </select>
          </div>
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={() => setGenderFilter('female')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              genderFilter === 'female'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>Pakistani Female Artists (5) • خواتین صدا کار</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </button>

          <button
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Voices (8)
          </button>

          <button
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'male'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Male Voices (3)
          </button>
        </div>

        {/* Voice Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            const isFemale = voice.gender === 'female';
            return (
              <div
                key={voice.id}
                onClick={() => handleVoiceSelect(voice)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500/60 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${
                        isFemale
                          ? isSelected
                            ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-slate-950'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {voice.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-white">
                          {voice.name}
                        </h4>
                        {voice.isPopular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-rose-300/90 font-medium font-urdu block leading-tight">
                        {voice.urduName}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </div>

                {/* Accent Tag */}
                <div className="mt-2.5 flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                    📍 {voice.accent}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                  {voice.tone}
                </p>

                <div className="mt-2 text-[10px] font-medium text-amber-400/90 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/20 truncate">
                  🎯 {voice.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pronunciation Rule Alert */}
        <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pakistani Urdu Pronunciation Strict Rules:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
              40W → <strong className="text-amber-400">چالیس واٹ</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
              D-Kart → <strong className="text-amber-400">ڈی کارٹ</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
              Active Model: <strong className="text-emerald-400">{selectedModel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Script Breakdown & Urdu Nastaliq Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <h3 className="font-bold text-white text-base">
              Commercial Script (19-Second Commercial Breakdown)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              {isEditing ? 'View Breakdown' : 'Edit Script'}
            </button>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-colors cursor-pointer font-medium"
              title="VS Code, GitHub, Render & Vercel deployment instructions"
            >
              <Github className="w-3.5 h-3.5" />
              <span>VS Code & Deploy Guide</span>
            </button>
          </div>
        </div>

        {/* Script Content / Breakdown */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={6}
              dir="rtl"
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 font-urdu text-xl text-amber-200 focus:outline-hidden focus:border-amber-500 leading-loose"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={handleResetScript}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to User Exact Script</span>
              </button>
              <span>{scriptText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {SCRIPT_LINES.map((line, idx) => {
              const isActive = activeLineIndex === idx;
              return (
                <div
                  key={line.id}
                  onClick={() => onLineClick && onLineClick(line.startTime)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          line.role === 'Hook'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : line.role === 'Feature'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : line.role === 'Convenience'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        Act {line.id}: {line.role}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {line.startTime.toFixed(1)}s - {line.endTime.toFixed(1)}s (
                        {(line.endTime - line.startTime).toFixed(1)}s)
                      </span>
                    </div>

                    {line.pronunciationNote && (
                      <span className="text-[10px] text-amber-400/90 hidden sm:inline-block italic">
                        {line.pronunciationNote}
                      </span>
                    )}
                  </div>

                  {/* Urdu Nastaliq Primary Text */}
                  <div className="pt-3 pb-1 text-right">
                    <p className="text-xl sm:text-2xl font-bold font-urdu text-amber-200 tracking-wide leading-relaxed">
                      {line.urdu}
                    </p>
                  </div>

                  {/* Roman Urdu & English translation */}
                  <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400 font-sans">
                    <p className="italic text-slate-300 font-medium">"{line.roman}"</p>
                    <p className="text-slate-500">{line.english}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Generate Button Action Box */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Broadcast Guarantee:</span> Spoken voice-over audio only, no background noise, pure studio voice in native Pakistani Urdu.
          </div>

          <button
            onClick={handleTriggerGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                <span>Generating with Gemini 3.8 Flash TTS...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-slate-950" />
                <span>Generate Voice-Over Audio (19s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export & Deployment Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};
