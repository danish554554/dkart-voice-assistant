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
      {/* Voice Selection & Style Bar (Gemini cosmic navy style) */}
      <div className="bg-[#101628]/85 border border-[#1e2a44] rounded-2xl p-5 shadow-lg space-y-4 text-[#e2e8f5] backdrop-blur-md">
        {/* Model & Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c263c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#18233d] border border-[#28395e] flex items-center justify-center text-[#8ab4f8]">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#f2f5fc] text-sm sm:text-base">
                Voice Artists & Models (Pakistani Urdu Accent)
              </h3>
              <p className="text-xs text-[#8090ad]">
                Choose from 5 distinct Pakistani female commercial voices or switch TTS models
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Model Switcher */}
            <div className="flex items-center bg-[#0a0f1e] border border-[#1c263c] rounded-xl p-1 text-xs">
              {MODEL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onModelChange(m.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium font-mono ${
                    selectedModel === m.id
                      ? 'bg-[#8ab4f8] text-[#0a0e1a] font-bold shadow-xs'
                      : 'text-[#8898b8] hover:text-white'
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
              className="bg-[#0e1424] border border-[#1c263c] rounded-lg px-2.5 py-1.5 text-xs text-[#e2e8f5] font-medium focus:outline-hidden focus:border-[#8ab4f8]"
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
                ? 'bg-[#18233d] text-white border border-[#8ab4f8]/50 shadow-sm'
                : 'text-[#8a98b4] hover:text-white bg-[#0e1424] border border-[#1c263c]'
            }`}
          >
            <span>Pakistani Female Artists (5) • خواتین صدا کار</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
          </button>

          <button
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'all'
                ? 'bg-[#18233d] text-white border border-[#8ab4f8]/50 shadow-sm'
                : 'text-[#8a98b4] hover:text-white bg-[#0e1424] border border-[#1c263c]'
            }`}
          >
            All Voices (8)
          </button>

          <button
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              genderFilter === 'male'
                ? 'bg-[#18233d] text-white border border-[#8ab4f8]/50 shadow-sm'
                : 'text-[#8a98b4] hover:text-white bg-[#0e1424] border border-[#1c263c]'
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
                    ? 'bg-[#1a2644] border-[#8ab4f8] ring-1 ring-[#8ab4f8]/40 shadow-md'
                    : 'bg-[#0e1424] border-[#1c263c] hover:border-[#2a3c64] hover:bg-[#131b30]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shadow-xs ${
                        isSelected
                          ? 'bg-[#8ab4f8] text-[#0a0e1a]'
                          : 'bg-[#18233d] text-[#8ab4f8] border border-[#28395e]'
                      }`}
                    >
                      {voice.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-[#ededf2]">
                          {voice.name}
                        </h4>
                        {voice.isPopular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/30 font-mono font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#909cb4] font-medium font-urdu block leading-tight">
                        {voice.urduName}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#8ab4f8] shrink-0" />
                  )}
                </div>

                {/* Accent Tag */}
                <div className="mt-2.5 flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#141d33] border border-[#223050] text-[#8ab4f8] font-mono">
                    📍 {voice.accent}
                  </span>
                </div>

                <p className="text-[11px] text-[#909cb4] mt-2 line-clamp-2">
                  {voice.tone}
                </p>

                <div className="mt-2 text-[10px] font-mono text-[#a5b2cc] bg-[#141d33] px-2 py-0.5 rounded border border-[#223050] truncate">
                  🎯 {voice.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pronunciation Rule Alert */}
        <div className="mt-2 p-3 rounded-xl bg-[#0e1424] border border-[#1c263c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#e2e8f5] font-semibold">
            <Info className="w-4 h-4 text-[#8ab4f8] shrink-0" />
            <span>Pakistani Urdu Pronunciation Tips:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[#95a2bd]">
            <span className="px-2 py-0.5 rounded bg-[#16223d] border border-[#253658] font-mono text-[11px] text-[#ededf5]">
              Brand Names → <strong className="text-[#8ab4f8]">اردو رسم الخط (e.g. ڈی کارٹ)</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#16223d] border border-[#253658] font-mono text-[11px] text-[#ededf5]">
              Natural Pauses → <strong className="text-[#8ab4f8]">، اور ۔ استعمال کریں</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#16223d] border border-[#253658] font-mono text-[11px] text-[#8090ad]">
              Model: <strong className="text-white">{selectedModel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Voicemaker Style: Script & Speech Synthesis Studio Card */}
      <div className="bg-[#101628]/85 border border-[#1e2a44] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 text-[#e2e8f5] backdrop-blur-md">
        {/* Voicemaker Studio Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1c263c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18233d] border border-[#28395e] flex items-center justify-center text-[#8ab4f8]">
              <FileAudio className="w-5 h-5 text-[#8ab4f8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#f2f5fc] text-base sm:text-lg">
                  Text to Speech Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#18233d] text-[#8ab4f8] border border-[#28395e] font-bold">
                  اردو - پاکستان (Urdu)
                </span>
              </div>
              <p className="text-xs text-[#8090ad] mt-0.5">
                Type or edit your Urdu script, adjust speed & pacing, then convert to speech
              </p>
            </div>
          </div>

          {/* Quick SSML / Text Toolbar (Voicemaker Style) */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <button
              onClick={() => handleInsertPause('short')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#0e1424] hover:bg-[#18233d] text-[#c0d0ec] border border-[#1c263c] transition-colors cursor-pointer flex items-center gap-1"
              title="Insert a short natural breathing pause (Urdu comma)"
            >
              <Clock className="w-3 h-3 text-[#8ab4f8]" />
              <span>+ Pause 0.5s</span>
            </button>

            <button
              onClick={() => handleInsertPause('long')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#0e1424] hover:bg-[#18233d] text-[#c0d0ec] border border-[#1c263c] transition-colors cursor-pointer flex items-center gap-1"
              title="Insert a sentence-ending pause (Urdu period)"
            >
              <Clock className="w-3 h-3 text-[#8ab4f8]" />
              <span>+ Pause 1.0s</span>
            </button>

            <button
              onClick={handleResetScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#0e1424] hover:bg-[#18233d] text-[#c0d0ec] border border-[#1c263c] transition-colors cursor-pointer flex items-center gap-1"
              title="Load sample commercial script"
            >
              <RotateCcw className="w-3 h-3 text-[#8ab4f8]" />
              <span>Sample Script</span>
            </button>

            <button
              onClick={handleClearScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#0e1424] hover:bg-[#18233d] text-[#8090ad] hover:text-white border border-[#1c263c] transition-colors cursor-pointer flex items-center gap-1"
              title="Clear script"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleCopyScript}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#0e1424] hover:bg-[#18233d] text-[#c0d0ec] border border-[#1c263c] transition-colors cursor-pointer flex items-center gap-1"
              title="Copy script to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#8090ad]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#18233d] hover:bg-[#223052] text-[#8ab4f8] border border-[#28395e] transition-colors cursor-pointer font-medium flex items-center gap-1"
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
              <div className="flex items-center bg-[#0a0f1e] border border-[#1c263c] rounded-xl p-1">
                <button
                  onClick={() => setScriptView('editor')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                    scriptView === 'editor'
                      ? 'bg-[#18233d] text-[#8ab4f8] border border-[#8ab4f8]/30 shadow-xs font-semibold'
                      : 'text-[#8090ad] hover:text-[#e0e8f5]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#8ab4f8]" />
                  <span>Text Editor</span>
                </button>
                <button
                  onClick={() => setScriptView('breakdown')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                    scriptView === 'breakdown'
                      ? 'bg-[#18233d] text-[#8ab4f8] border border-[#8ab4f8]/30 shadow-xs font-semibold'
                      : 'text-[#8090ad] hover:text-[#e0e8f5]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Scene Breakdown (Act 1-4)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[#8090ad] bg-[#0e1424] px-2.5 py-1.5 rounded-xl border border-[#1c263c] text-[11px]">
                <span>
                  chars: <strong className="text-white">{charCount}</strong>
                </span>
                <span className="text-[#2c3d64]">|</span>
                <span>
                  words: <strong className="text-white">{wordCount}</strong>
                </span>
                <span className="text-[#2c3d64]">|</span>
                <span>
                  est: <strong className="text-[#8ab4f8]">~{estimatedSeconds}s</strong>
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
                    className="w-full h-full min-h-[340px] p-5 rounded-2xl bg-[#0a0f1e] border border-[#1c263c] font-urdu text-xl sm:text-2xl text-[#f4f7fc] placeholder-[#4e5e7c] focus:outline-hidden focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] leading-[2.2] tracking-wide resize-y shadow-inner transition-all selection:bg-[#8ab4f8]/30 selection:text-white"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8090ad] font-sans">
                  <span className="flex items-center gap-1.5 text-[#9ab0d4]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8ab4f8]" /> High-conversion Urdu Nastaliq
                  </span>
                  <span className="italic text-[#687898]">
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
                          ? 'bg-[#192544] border-[#8ab4f8] ring-1 ring-[#8ab4f8]/40 shadow-sm'
                          : 'bg-[#0e1424] border-[#1c263c] hover:border-[#2a3c64] hover:bg-[#131b30]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#1c263c]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#16223d] text-[#8ab4f8] border border-[#253658]">
                            Act {line.id}: {line.role}
                          </span>
                          <span className="font-mono text-[#8090ad] text-[11px]">
                            {line.startTime.toFixed(1)}s - {line.endTime.toFixed(1)}s
                          </span>
                        </div>

                        {line.pronunciationNote && (
                          <span className="text-[10px] text-[#7888a6] hidden sm:inline-block italic">
                            {line.pronunciationNote}
                          </span>
                        )}
                      </div>

                      {/* Urdu Nastaliq Primary Text */}
                      <div className="pt-2 pb-1 text-right">
                        <p className="text-xl font-bold font-urdu text-[#f2f5fc] tracking-wide leading-relaxed">
                          {line.urdu}
                        </p>
                      </div>

                      {/* Roman Urdu & English translation */}
                      <div className="pt-1.5 border-t border-[#1c263c] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#8090ad] font-sans">
                        <p className="italic text-[#c0d0ec] font-medium">"{line.roman}"</p>
                        <p className="text-[#8090ad]">{line.english}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Voice Settings & Generate / Download Buttons Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-[#1c263c] space-y-4 shadow-inner text-[#e2e8f5]">
            <div className="space-y-4">
              {/* Settings Panel Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1c263c]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#8ab4f8]" />
                  <h4 className="font-bold text-[#ededf2] text-xs sm:text-sm font-mono">
                    Voice Settings & Controls
                  </h4>
                </div>
                <span className="text-[10px] text-[#8ab4f8] font-mono font-medium bg-[#18233d] px-2 py-0.5 rounded border border-[#28395e]">
                  Gemini Audio
                </span>
              </div>

              {/* Speed Control (matching screenshot) */}
              <div className="space-y-2 bg-[#12192d] p-3.5 rounded-xl border border-[#1f2b45]">
                <div className="flex items-center justify-between">
                  <span className="text-[#c0d0ec] font-semibold text-xs flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    Voice Speed:
                  </span>
                  <span className="font-mono text-[#8ab4f8] font-bold text-xs bg-[#18233d] px-2 py-0.5 rounded border border-[#28395e]">
                    {playbackRate}x {playbackRate > 1 ? `(+${Math.round((playbackRate - 1) * 100)}%)` : playbackRate < 1 ? `(${Math.round((playbackRate - 1) * 100)}%)` : '(100%)'}
                  </span>
                </div>

                {/* Speed Pills */}
                <div className="flex items-center gap-1 bg-[#0a0f1e] p-1 rounded-xl border border-[#1c263c]">
                  {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSpeedSelect(rate)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-[#8ab4f8] text-[#0a0e1a] shadow-xs'
                          : 'text-[#8090ad] hover:text-white'
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
                    className="w-full h-1.5 bg-[#1c263c] rounded-lg appearance-none cursor-pointer accent-[#8ab4f8]"
                  />
                  <div className="flex justify-between text-[10px] text-[#7080a0] mt-1 font-mono">
                    <span>0.5x Slow</span>
                    <span>1.0x Normal</span>
                    <span>2.0x Fast</span>
                  </div>
                </div>
              </div>

              {/* Delivery Pacing & Target Duration in stacked blocks */}
              <div className="grid grid-cols-1 gap-3 text-xs">
                {/* Pacing & Delivery Tone */}
                <div className="space-y-1.5 bg-[#12192d] p-3 rounded-xl border border-[#1f2b45]">
                  <label className="text-[#c0d0ec] font-semibold flex items-center gap-1.5">
                    <Volume1 className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    Delivery Pacing:
                  </label>
                  <select
                    value={selectedPace}
                    onChange={(e) => setSelectedPace(e.target.value)}
                    className="w-full bg-[#0a0f1e] border border-[#1c263c] rounded-lg px-2.5 py-1.5 text-xs text-[#e2e8f5] font-medium focus:outline-hidden focus:border-[#8ab4f8]"
                  >
                    <option value="moderately fast">Moderately Fast (Standard 19s)</option>
                    <option value="fast & viral">Fast & Urgent (16s TikTok)</option>
                    <option value="conversational & natural">Warm & Conversational (20s)</option>
                    <option value="steady & clear">Steady Commercial (24s Meta)</option>
                  </select>
                </div>

                {/* Target Duration Mode */}
                <div className="space-y-1.5 bg-[#12192d] p-3 rounded-xl border border-[#1f2b45]">
                  <label className="text-[#c0d0ec] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    Target Duration:
                  </label>
                  <select
                    value={targetDurationMode}
                    onChange={(e) => setTargetDurationMode(e.target.value)}
                    className="w-full bg-[#0a0f1e] border border-[#1c263c] rounded-lg px-2.5 py-1.5 text-xs text-[#e2e8f5] font-medium focus:outline-hidden focus:border-[#8ab4f8]"
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
                        className="w-20 bg-[#0a0f1e] border border-[#1c263c] rounded-lg px-2 py-1 text-xs text-[#e2e8f5] font-mono"
                      />
                      <span className="text-[10px] text-[#8090ad] font-mono">sec target</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Note */}
              <div className="px-3 py-2 rounded-xl bg-[#12192d] border border-[#1f2b45] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#9ab0d4]">
                  <span className="w-2 h-2 rounded-full bg-[#8ab4f8] animate-pulse"></span>
                  Export Speed:
                </span>
                <span className="font-mono text-[#8ab4f8] font-bold">
                  {playbackRate}x WAV Render
                </span>
              </div>
            </div>

            {/* Voicemaker Action Buttons */}
            <div className="pt-3 border-t border-[#1c263c] space-y-2.5">
              {/* Primary Convert Button */}
              <button
                type="button"
                onClick={handleTriggerGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-[#8ab4f8] to-[#689ef7] hover:from-[#9bc0fa] hover:to-[#7aa9f8] text-[#0a0e1a] font-mono font-bold tracking-wider uppercase text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#0a0e1a]" />
                    <span>SYNTHESIZING AUDIO...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-[#0a0e1a]" />
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
                  className="w-full py-3 px-4 rounded-xl bg-[#18233d] hover:bg-[#202f52] text-[#f0f4fc] font-mono font-bold text-xs sm:text-sm border border-[#28395e] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98 disabled:opacity-50"
                  title={`Download audio rendered at ${playbackRate}x speed`}
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="w-4 h-4 text-[#8ab4f8] animate-spin" />
                      <span>Rendering {playbackRate}x WAV...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#8ab4f8]" />
                      <span>DOWNLOAD WAV ({playbackRate}x)</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-[11px] text-[#607090] text-center font-mono">
                  convert script to unlock {playbackRate}x download
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Master Audio Player & Waveform Visualizer */}
        {audioBase64 ? (
          <div className="pt-4 border-t border-[#1c263c]">
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
          <div className="pt-3 border-t border-[#1c263c] flex items-center justify-between text-xs text-[#8090ad] bg-[#0e1424] p-3.5 rounded-xl border border-[#1c263c]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
              <span>
                Enter your script above and click <strong className="text-white font-bold">"CONVERT TO SPEECH"</strong> to synthesize Pakistani Urdu audio.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8ab4f8] bg-[#18233d] px-2 py-0.5 rounded border border-[#28395e] hidden sm:inline">
              READY
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
