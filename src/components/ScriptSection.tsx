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
  Download,
  Gauge,
  Clock,
  Trash2,
  PlusCircle,
  FileText,
  Volume1,
  Radio,
  FileAudio,
} from 'lucide-react';
import { SCRIPT_LINES, VOICE_OPTIONS, MODEL_OPTIONS, EXACT_URDU_SCRIPT } from '../data/commercialData';
import { VoiceOption } from '../types';
import { ExportModal } from './ExportModal';
import { exportAudioAtSpeed } from '../utils/audioExport';
import { AudioPlayer } from './AudioPlayer';

interface ScriptSectionProps {
  onGenerate: (config: {
    voice: string;
    baseVoice?: string;
    model?: string;
    style: string;
    pace: string;
    script: string;
    targetDuration?: string | number;
  }) => void;
  isGenerating: boolean;
  selectedVoice: string;
  onVoiceChange: (voice: string, baseVoice?: string, defaultStyle?: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  activeLineIndex?: number;
  onLineClick?: (startTime: number) => void;
  audioBase64?: string | null;
  mimeType?: string;
  source?: string;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
  duration?: number;
  targetDuration?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSeekRequest?: (time: number) => void;
  scriptText?: string;
  onScriptTextChange?: (text: string) => void;
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
  audioBase64,
  mimeType = 'audio/wav',
  source = 'gemini-3.8-flash-tts',
  playbackRate = 1.0,
  onPlaybackRateChange,
  duration = 19,
  targetDuration = 19,
  onTimeUpdate,
  onSeekRequest,
  scriptText: propScriptText,
  onScriptTextChange,
}) => {
  const [internalScriptText, setInternalScriptText] = useState<string>('');
  const scriptText = propScriptText !== undefined ? propScriptText : internalScriptText;
  const setScriptText = (text: string | ((prev: string) => string)) => {
    if (typeof text === 'function') {
      const next = text(scriptText);
      if (onScriptTextChange) onScriptTextChange(next);
      setInternalScriptText(next);
    } else {
      if (onScriptTextChange) onScriptTextChange(text);
      setInternalScriptText(text);
    }
  };

  const [scriptView, setScriptView] = useState<'editor' | 'breakdown'>('editor');
  const [copied, setCopied] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [selectedPace, setSelectedPace] = useState<string>('moderately fast');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('female');
  const [targetDurationMode, setTargetDurationMode] = useState<string>('auto');
  const [customDurationInput, setCustomDurationInput] = useState<number>(19);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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

  const handleClearScript = () => {
    setScriptText('');
  };

  const handleInsertPause = (pauseType: 'short' | 'long') => {
    // Inserts Urdu punctuation that triggers natural speech pauses in TTS models
    const pauseChar = pauseType === 'short' ? '، ' : '۔ ';
    setScriptText((prev) => (prev.endsWith(' ') ? prev + pauseChar : prev + ' ' + pauseChar));
  };

  const handleVoiceSelect = (voice: typeof VOICE_OPTIONS[0]) => {
    onVoiceChange(voice.id, voice.baseVoice, voice.sampleStyle);
    setStylePreset(voice.sampleStyle);
  };

  const handleSpeedSelect = (speed: number) => {
    if (onPlaybackRateChange) {
      onPlaybackRateChange(speed);
    }
  };

  const handleTriggerGenerate = () => {
    if (!scriptText.trim()) {
      alert('Please enter or paste your Urdu script before converting to speech.');
      return;
    }

    const finalTarget =
      targetDurationMode === 'auto'
        ? 'auto'
        : targetDurationMode === 'custom'
        ? customDurationInput
        : Number(targetDurationMode);

    onGenerate({
      voice: currentVoiceObj.id,
      baseVoice: currentVoiceObj.baseVoice,
      model: selectedModel,
      style: stylePreset,
      pace: selectedPace,
      script: scriptText,
      targetDuration: finalTarget,
    });
  };

  const handleDownloadAtSpeed = async () => {
    if (!audioBase64 || isExporting) return;
    setIsExporting(true);
    try {
      await exportAudioAtSpeed(
        audioBase64,
        mimeType,
        playbackRate,
        'd-kart-urdu-commercial',
        currentVoiceObj.name
      );
    } catch (e) {
      console.error('Download at speed error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const wordCount = scriptText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = scriptText.length;
  // Estimated duration in seconds adjusted for playback rate
  const estimatedSeconds = Math.max(
    2,
    Math.round(wordCount / (2.5 * playbackRate))
  );

  const filteredVoices = VOICE_OPTIONS.filter((v) => {
    if (genderFilter === 'female') return v.gender === 'female';
    if (genderFilter === 'male') return v.gender === 'male';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Voice Selection & Style Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 text-zinc-900">
        {/* Model & Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
                Voice Artists & Models (Pakistani Urdu Accent)
              </h3>
              <p className="text-xs text-zinc-500">
                Choose from 5 distinct Pakistani female commercial voices or switch TTS models
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Model Switcher */}
            <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-xl p-1 text-xs">
              {MODEL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onModelChange(m.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                    selectedModel === m.id
                      ? 'bg-black text-white font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-black'
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
              className="bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium focus:outline-hidden focus:border-black"
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
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-zinc-600 hover:text-black border border-zinc-200'
            }`}
          >
            <span>Pakistani Female Artists (5) • خواتین صدا کار</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </button>

          <button
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'all'
                ? 'bg-black text-white font-bold shadow-sm'
                : 'bg-white text-zinc-600 hover:text-black border border-zinc-200'
            }`}
          >
            All Voices (8)
          </button>

          <button
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'male'
                ? 'bg-black text-white font-bold shadow-sm'
                : 'bg-white text-zinc-600 hover:text-black border border-zinc-200'
            }`}
          >
            Male Voices (3)
          </button>
        </div>

        {/* Voice Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <div
                key={voice.id}
                onClick={() => handleVoiceSelect(voice)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-zinc-50 border-black ring-1 ring-black shadow-sm'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-xs ${
                        isSelected
                          ? 'bg-black text-white'
                          : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      }`}
                    >
                      {voice.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-zinc-900">
                          {voice.name}
                        </h4>
                        {voice.isPopular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 font-medium font-urdu block leading-tight">
                        {voice.urduName}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  )}
                </div>

                {/* Accent Tag */}
                <div className="mt-2.5 flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium">
                    📍 {voice.accent}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-600 mt-2 line-clamp-2">
                  {voice.tone}
                </p>

                <div className="mt-2 text-[10px] font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 truncate">
                  🎯 {voice.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pronunciation Rule Alert */}
        <div className="mt-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <Info className="w-4 h-4 text-zinc-900 shrink-0" />
            <span>Pakistani Urdu Pronunciation Rules:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-zinc-700">
            <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[11px]">
              40W → <strong className="text-zinc-950">چالیس واٹ</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[11px]">
              D-Kart → <strong className="text-zinc-950">ڈی کارٹ</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[11px]">
              Model: <strong className="text-zinc-950">{selectedModel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Voicemaker Style: Script & Speech Synthesis Studio Card */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 text-zinc-900">
        {/* Voicemaker Studio Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
              <FileAudio className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-900 text-base sm:text-lg">
                  Text to Speech Studio
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold">
                  اردو - پاکستان (Urdu)
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Type or edit your Urdu script, adjust speed & pacing, then convert to speech
              </p>
            </div>
          </div>

          {/* Quick SSML / Text Toolbar (Voicemaker Style) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleInsertPause('short')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              title="Insert a short natural breathing pause (Urdu comma)"
            >
              <Clock className="w-3 h-3 text-zinc-900" />
              <span>+ Pause 0.5s</span>
            </button>

            <button
              onClick={() => handleInsertPause('long')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              title="Insert a sentence-ending pause (Urdu period)"
            >
              <Clock className="w-3 h-3 text-zinc-900" />
              <span>+ Pause 1.0s</span>
            </button>

            <button
              onClick={handleResetScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              title="Load sample commercial script"
            >
              <RotateCcw className="w-3 h-3 text-zinc-900" />
              <span>Sample Script</span>
            </button>

            <button
              onClick={handleClearScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-600 hover:text-black border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Clear script"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleCopyScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              title="Copy script to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-black" />
                  <span className="text-black font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-600" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition-colors cursor-pointer font-medium flex items-center gap-1"
              title="Deployment and Export Guide"
            >
              <Github className="w-3 h-3" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>

        {/* Horizontal Workspace: Left: Script Text Area | Right: Voice Settings & Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT SIDE: Text Editor / Scene Breakdown (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* View Switcher & Counter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-xl p-1">
                <button
                  onClick={() => setScriptView('editor')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                    scriptView === 'editor'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Text Editor (Voicemaker)</span>
                </button>
                <button
                  onClick={() => setScriptView('breakdown')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                    scriptView === 'breakdown'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Scene Breakdown (Act 1-4)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1.5 rounded-xl border border-zinc-200 text-[11px]">
                <span>
                  Chars: <strong className="text-zinc-950">{charCount}</strong>
                </span>
                <span className="text-zinc-300">|</span>
                <span>
                  Words: <strong className="text-zinc-950">{wordCount}</strong>
                </span>
                <span className="text-zinc-300">|</span>
                <span>
                  Est: <strong className="text-zinc-950">~{estimatedSeconds}s</strong>
                </span>
              </div>
            </div>

            {/* Script Content / Breakdown */}
            {scriptView === 'editor' ? (
              <div className="flex-1 flex flex-col space-y-2">
                <div className="relative flex-1">
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    rows={12}
                    dir="rtl"
                    placeholder="یہاں اپنا اردو کمرشل اسکرپٹ لکھیں یا پیسٹ کریں..."
                    className="w-full h-full min-h-[340px] p-5 rounded-2xl bg-white border border-zinc-300 font-urdu text-xl sm:text-2xl text-zinc-950 placeholder-zinc-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black leading-[2.2] tracking-wide resize-y shadow-inner transition-all"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                  <span className="flex items-center gap-1.5 text-zinc-800">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-900" /> High-conversion Urdu Nastaliq
                  </span>
                  <span className="italic">
                    * Native Urdu punctuation (، اور ۔) triggers pauses
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 max-h-[460px] overflow-y-auto pr-1 space-y-3">
                {SCRIPT_LINES.map((line, idx) => {
                  const isActive = activeLineIndex === idx;
                  return (
                    <div
                      key={line.id}
                      onClick={() => onLineClick && onLineClick(line.startTime)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-zinc-100 border-black ring-1 ring-black shadow-sm'
                          : 'bg-white border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
                            Act {line.id}: {line.role}
                          </span>
                          <span className="font-mono text-zinc-500 text-[11px]">
                            {line.startTime.toFixed(1)}s - {line.endTime.toFixed(1)}s
                          </span>
                        </div>

                        {line.pronunciationNote && (
                          <span className="text-[10px] text-zinc-600 hidden sm:inline-block italic">
                            {line.pronunciationNote}
                          </span>
                        )}
                      </div>

                      {/* Urdu Nastaliq Primary Text */}
                      <div className="pt-2 pb-1 text-right">
                        <p className="text-xl font-bold font-urdu text-zinc-950 tracking-wide leading-relaxed">
                          {line.urdu}
                        </p>
                      </div>

                      {/* Roman Urdu & English translation */}
                      <div className="pt-1.5 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-zinc-500 font-sans">
                        <p className="italic text-zinc-700 font-medium">"{line.roman}"</p>
                        <p className="text-zinc-500">{line.english}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Voice Settings & Generate / Download Buttons Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 shadow-sm text-zinc-900">
            <div className="space-y-4">
              {/* Settings Panel Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-zinc-900" />
                  <h4 className="font-bold text-zinc-900 text-xs sm:text-sm">
                    Voice Settings & Controls
                  </h4>
                </div>
                <span className="text-[10px] text-zinc-800 font-mono font-medium bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  Voicemaker Engine
                </span>
              </div>

              {/* Speed Control (matching screenshot) */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-800 font-semibold text-xs flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-zinc-900" />
                    Voice Speed:
                  </span>
                  <span className="font-mono text-zinc-900 font-bold text-xs bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {playbackRate}x {playbackRate > 1 ? `(+${Math.round((playbackRate - 1) * 100)}%)` : playbackRate < 1 ? `(${Math.round((playbackRate - 1) * 100)}%)` : '(100%)'}
                  </span>
                </div>

                {/* Speed Pills (matching user screenshot) */}
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                  {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSpeedSelect(rate)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-black text-white shadow-xs'
                          : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      {rate === 1.0 ? '1x' : `${rate}x`}
                    </button>
                  ))}
                </div>

                {/* Speed Range Slider */}
                <div className="pt-1">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={playbackRate}
                    onChange={(e) => handleSpeedSelect(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                    <span>0.5x Slow</span>
                    <span>1.0x Normal</span>
                    <span>2.0x Fast</span>
                  </div>
                </div>
              </div>

              {/* Delivery Pacing & Target Duration in stacked blocks */}
              <div className="grid grid-cols-1 gap-3 text-xs">
                {/* Pacing & Delivery Tone */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-zinc-200">
                  <label className="text-zinc-800 font-semibold flex items-center gap-1.5">
                    <Volume1 className="w-3.5 h-3.5 text-zinc-900" />
                    Delivery Pacing:
                  </label>
                  <select
                    value={selectedPace}
                    onChange={(e) => setSelectedPace(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium focus:outline-hidden focus:border-black"
                  >
                    <option value="moderately fast">Moderately Fast (Standard 19s)</option>
                    <option value="fast & viral">Fast & Urgent (16s TikTok)</option>
                    <option value="conversational & natural">Warm & Conversational (20s)</option>
                    <option value="steady & clear">Steady Commercial (24s Meta)</option>
                  </select>
                </div>

                {/* Target Duration Mode */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-zinc-200">
                  <label className="text-zinc-800 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-900" />
                    Target Duration:
                  </label>
                  <select
                    value={targetDurationMode}
                    onChange={(e) => setTargetDurationMode(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium focus:outline-hidden focus:border-black"
                  >
                    <option value="auto">Auto (Natural Script Duration)</option>
                    <option value="15">15 Seconds (Short Reel / TikTok)</option>
                    <option value="20">20 Seconds (Standard Commercial)</option>
                    <option value="30">30 Seconds (Extended Ad / Story)</option>
                    <option value="60">60 Seconds (Full Product Demo)</option>
                    <option value="custom">Custom Duration...</option>
                  </select>

                  {targetDurationMode === 'custom' && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min="3"
                        max="180"
                        value={customDurationInput}
                        onChange={(e) => setCustomDurationInput(Math.max(3, parseInt(e.target.value) || 15))}
                        className="w-20 bg-white border border-zinc-300 rounded-lg px-2 py-1 text-xs text-zinc-900 font-mono"
                      />
                      <span className="text-[10px] text-zinc-500">sec target</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Note */}
              <div className="px-3 py-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                  Export Speed:
                </span>
                <span className="font-mono text-zinc-950 font-bold">
                  {playbackRate}x WAV Render
                </span>
              </div>
            </div>

            {/* Voicemaker Action Buttons (CONVERT TO SPEECH & DOWNLOAD AUDIO) */}
            <div className="pt-3 border-t border-zinc-200 space-y-2.5">
              {/* Primary Convert Button */}
              <button
                type="button"
                onClick={handleTriggerGenerate}
                disabled={isGenerating}
                className="w-full py-4 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-black tracking-wider uppercase text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin text-white" />
                    <span>CONVERTING TO SPEECH...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-white fill-white" />
                    <span>CONVERT TO SPEECH</span>
                  </>
                )}
              </button>

              {/* Download Button */}
              {audioBase64 ? (
                <button
                  type="button"
                  onClick={handleDownloadAtSpeed}
                  disabled={isExporting}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm border border-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-98 disabled:opacity-50"
                  title={`Download audio rendered at ${playbackRate}x speed`}
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="w-4 h-4 text-zinc-900 animate-spin" />
                      <span>Rendering {playbackRate}x WAV...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-zinc-900" />
                      <span>DOWNLOAD AUDIO ({playbackRate}x)</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-[11px] text-zinc-400 text-center italic">
                  Generate audio to unlock {playbackRate}x speed download
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Master Audio Player & Waveform Visualizer (Appears right after converting speech) */}
        {audioBase64 ? (
          <div className="pt-4 border-t border-zinc-200">
            <AudioPlayer
              audioBase64={audioBase64}
              mimeType={mimeType}
              source={source}
              model={selectedModel}
              voiceUsed={`${currentVoiceObj.name} (${currentVoiceObj.accent})`}
              onTimeUpdate={onTimeUpdate}
              onSeekRequest={onSeekRequest}
              targetDuration={typeof targetDuration === 'number' ? targetDuration : duration}
              playbackRate={playbackRate}
              onPlaybackRateChange={onPlaybackRateChange}
            />
          </div>
        ) : (
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50 p-3.5 rounded-xl border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <span>
                Enter your script above and click <strong className="text-zinc-900 font-bold">"CONVERT TO SPEECH"</strong> to generate the Pakistani Urdu voice-over waveform and audio player.
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              Ready for Urdu Text
            </span>
          </div>
        )}
      </div>

      {/* Export & Deployment Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};
