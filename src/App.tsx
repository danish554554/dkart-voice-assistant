import React, { useState, useEffect, useCallback } from 'react';
import {
  Mic,
  Sparkles,
  Volume2,
  Video,
  Layers,
  FileText,
  Radio,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShoppingBag,
  Flame,
  Zap,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AudioPlayer } from './components/AudioPlayer';
import { ReelPreview } from './components/ReelPreview';
import { ScriptSection } from './components/ScriptSection';
import { TimelineBreakdown } from './components/TimelineBreakdown';
import { SpecsSection } from './components/SpecsSection';
import { SCRIPT_LINES, EXACT_URDU_SCRIPT, VOICE_OPTIONS } from './data/commercialData';

export default function App() {
  const [scriptText, setScriptText] = useState<string>('');
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/wav');
  const [modelName, setModelName] = useState<string>('gemini-3.8-flash-tts');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash-tts');
  const [source, setSource] = useState<string>('gemini-3.8-flash-tts');
  const [selectedVoice, setSelectedVoice] = useState<string>('Ayesha-Kore');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(19);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [targetDuration, setTargetDuration] = useState<string | number>('auto');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'studio' | 'reel' | 'storyboard' | 'specs'>('studio');

  const activeVoiceObj =
    VOICE_OPTIONS.find((v) => v.id === selectedVoice) || VOICE_OPTIONS[0];

  // Find active script line index scaled to actual duration
  const durationScale = duration > 0 ? duration / 19 : 1;
  const activeLineIndex = SCRIPT_LINES.findIndex(
    (line) =>
      currentTime >= line.startTime * durationScale &&
      currentTime < line.endTime * durationScale
  );
  const currentLineIdx = activeLineIndex !== -1 ? activeLineIndex : 0;

  // Handle generation via backend /api/tts
  const generateVoiceOver = useCallback(
    async (config?: {
      voice?: string;
      baseVoice?: string;
      model?: string;
      style?: string;
      pace?: string;
      script?: string;
      targetDuration?: string | number;
    }) => {
      const scriptToUse = config?.script !== undefined ? config.script : scriptText;

      // Ensure user has provided a script before generating voice
      if (!scriptToUse || !scriptToUse.trim()) {
        setErrorMessage('Please enter or paste your Urdu script first before converting to speech.');
        return;
      }

      setIsGenerating(true);
      setErrorMessage(null);

      const voiceToUse = config?.voice || selectedVoice;
      const modelToUse = config?.model || selectedModel;
      const voiceObj =
        VOICE_OPTIONS.find((v) => v.id === voiceToUse) || activeVoiceObj;
      const baseVoiceToUse = config?.baseVoice || voiceObj.baseVoice;
      const paceToUse = config?.pace || 'moderately fast';
      const styleToUse = config?.style || voiceObj.sampleStyle;
      const targetDurationToUse =
        config?.targetDuration !== undefined ? config.targetDuration : targetDuration;

      if (config?.targetDuration !== undefined) {
        setTargetDuration(config.targetDuration);
      }

      setStatusMessage(
        `Recording Pakistani Urdu voice-over with ${voiceObj.name} using ${modelToUse}...`
      );

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script: scriptToUse,
            voice: voiceToUse,
            baseVoice: baseVoiceToUse,
            model: modelToUse,
            pace: paceToUse,
            style: styleToUse,
            targetDuration: targetDurationToUse,
          }),
        });

        const data = await response.json();

        if (data.audioBase64) {
          setAudioBase64(data.audioBase64);
          setMimeType(data.mimeType || 'audio/wav');
          setSource(data.source || modelToUse);
          if (data.model) {
            setModelName(data.model);
            setSelectedModel(data.model);
          }
          if (data.voiceUsed) setSelectedVoice(data.voiceUsed);

          if (data.isQuotaExceeded) {
            setStatusMessage(
              data.quotaMessage ||
                'Gemini Free-tier daily limit reached (10 requests/day). Studio preview audio is active so you can continue testing playback, reel sync, and downloads.'
            );
          } else if (data.fallbackNotice) {
            setStatusMessage(data.fallbackNotice);
          } else if (data.fromCache) {
            setStatusMessage(
              `Loaded instant take for ${voiceObj.name} (${voiceObj.accent}) from studio cache!`
            );
          } else if (data.success) {
            setStatusMessage(
              `Broadcast voice-over generated with ${voiceObj.name} (${voiceObj.accent}) via ${modelToUse}!`
            );
          } else {
            setStatusMessage(data.message || 'Serving studio audio preview.');
          }
          setErrorMessage(null);
        } else {
          throw new Error(data.error || 'Failed to generate voice-over audio');
        }
      } catch (err: any) {
        console.error('TTS Generation Error:', err);
        setErrorMessage(
          err.message ||
            'An error occurred while connecting to the Gemini TTS service.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [selectedVoice, selectedModel, activeVoiceObj, scriptText, targetDuration]
  );

  const handleTimeUpdate = (cur: number, dur: number) => {
    setCurrentTime(cur);
    if (dur && !isNaN(dur) && isFinite(dur)) {
      setDuration(dur);
    }
  };

  const handleSeekRequest = (time: number) => {
    setCurrentTime(time);
  };

  const handleVoiceChange = (voiceId: string, baseVoice?: string, defaultStyle?: string) => {
    setSelectedVoice(voiceId);
    // Only re-generate automatically if audio has already been created previously
    if (audioBase64 && scriptText.trim()) {
      generateVoiceOver({ voice: voiceId, baseVoice, style: defaultStyle });
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setModelName(modelId);
    // Only re-generate automatically if audio has already been created previously
    if (audioBase64 && scriptText.trim()) {
      generateVoiceOver({ model: modelId });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e2e2e8] flex flex-col font-sans selection:bg-[#8ab4f8]/25 selection:text-white">
      {/* Top Studio Navbar */}
      <Navbar
        modelName={selectedModel}
        voiceName={activeVoiceObj.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Universal Studio Header Banner (Gemini-style cosmic command card) */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#131a2e]/90 to-[#0e1424]/90 border border-[#202b44] p-6 sm:p-7 shadow-xl backdrop-blur-md">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#18233d] text-[#e2e2ea] border border-[#28395e] font-mono font-medium text-xs flex items-center gap-1.5 shadow-xs">
                  <Mic className="w-3.5 h-3.5 text-[#8ab4f8]" />
                  <span>voice:</span>
                  <strong className="text-white">{activeVoiceObj.name}</strong>
                  <span className="text-[#8a98b4]">({activeVoiceObj.accent})</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233d] text-[#8ab4f8] border border-[#28395e] font-mono text-xs flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#8ab4f8] animate-pulse" />
                  <span>commercial-studio</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0e1424] text-[#8a98b4] font-mono text-xs border border-[#1b253b]">
                  model: <span className="text-[#c5c5d2]">{selectedModel}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/30 text-xs font-mono font-semibold">
                  {playbackRate}x speed
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f5f5f7] tracking-tight leading-tight">
                Pakistani Urdu Voice-Over Studio
                <span className="block text-[#8ab4f8] font-bold text-xl sm:text-2xl mt-1">
                  AI Commercial & Social Reels Production
                </span>
              </h1>

              <p className="text-sm text-[#95a2bd] leading-relaxed">
                Universal studio-grade Urdu text-to-speech for any e-commerce product, Daraz campaign, TikTok ads, or Instagram reels. Featuring native Pakistani regional accents (Karachi, Lahore, Islamabad, Influencer, FM Radio) powered by Google Gemini TTS.
              </p>
            </div>

            {/* Studio Capabilities Overview (Gemini tool cards) */}
            <div className="grid grid-cols-2 gap-2.5 w-full lg:w-auto shrink-0 text-xs">
              <div className="p-3 rounded-xl bg-[#141b2f]/70 border border-[#222e4c] hover:border-[#8ab4f8]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold mb-1">
                  <Flame className="w-4 h-4 text-[#8ab4f8]" />
                  <span>Gemini 3.8</span>
                </div>
                <p className="text-[#8090ad] text-[11px] font-mono">24kHz Audio</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141b2f]/70 border border-[#222e4c] hover:border-[#8ab4f8]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5+ Accents</span>
                </div>
                <p className="text-[#8090ad] text-[11px] font-mono">Karachi, Lahore</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141b2f]/70 border border-[#222e4c] hover:border-[#8ab4f8]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>0.5x – 2.0x</span>
                </div>
                <p className="text-[#8090ad] text-[11px] font-mono">WAV Resampling</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141b2f]/70 border border-[#222e4c] hover:border-[#8ab4f8]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold mb-1">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>9:16 Sync</span>
                </div>
                <p className="text-[#8090ad] text-[11px] font-mono">Reels Mockup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between gap-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-semibold cursor-pointer text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {statusMessage && !errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#12192d]/85 border border-[#202b44] text-[#d0d8ec] text-xs flex items-center justify-between gap-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8ab4f8] shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <span className="text-[11px] font-mono text-[#7888a6]">
              source: {source}
            </span>
          </div>
        )}

        {/* Studio Navigation Tabs (Gemini-style cosmic tabs) */}
        <div className="flex items-center gap-1.5 border-b border-[#1d273d] pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-[#18233d] text-white border border-[#2a3c64] shadow-sm font-semibold'
                : 'text-[#8a98b4] hover:text-[#e0e0ea] hover:bg-[#141b2f]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>Commercial Voice Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('reel')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reel'
                ? 'bg-[#18233d] text-white border border-[#2a3c64] shadow-sm font-semibold'
                : 'text-[#8a98b4] hover:text-[#e0e0ea] hover:bg-[#141b2f]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Video Reel & Daraz Mockup</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'storyboard'
                ? 'bg-[#18233d] text-white border border-[#2a3c64] shadow-sm font-semibold'
                : 'text-[#8a98b4] hover:text-[#e0e0ea] hover:bg-[#141b2f]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Storyboard & Timing</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-[#18233d] text-white border border-[#2a3c64] shadow-sm font-semibold'
                : 'text-[#8a98b4] hover:text-[#e0e0ea] hover:bg-[#141b2f]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio Specifications & QC</span>
          </button>
        </div>

        {/* Tab 1: Studio Mode */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Full-width Workspace: Horizontal Script Editor & Voice Settings/Buttons + Audio Player */}
            <ScriptSection
              onGenerate={(config) => generateVoiceOver(config)}
              isGenerating={isGenerating}
              selectedVoice={selectedVoice}
              onVoiceChange={handleVoiceChange}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              activeLineIndex={currentLineIdx}
              onLineClick={(time) => handleSeekRequest(time)}
              audioBase64={audioBase64}
              mimeType={mimeType}
              source={source}
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
              duration={duration}
              targetDuration={typeof targetDuration === 'number' ? targetDuration : duration}
              onTimeUpdate={handleTimeUpdate}
              onSeekRequest={handleSeekRequest}
              scriptText={scriptText}
              onScriptTextChange={setScriptText}
            />

            {/* Live Synchronized Reel Preview & Scene Storyboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full bg-[#101628]/85 border border-[#1e2a44] rounded-2xl p-5 flex flex-col items-center shadow-lg backdrop-blur-md">
                  <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#1c263c]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
                      <h4 className="font-bold text-xs sm:text-sm text-[#ededf2]">
                        Live 9:16 Ad Reel Visualizer
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#8ab4f8] bg-[#18233d] px-2 py-0.5 rounded border border-[#28395e]">
                      sync: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                    </span>
                  </div>

                  <ReelPreview
                    currentTime={currentTime}
                    duration={duration}
                    voiceName={activeVoiceObj.name}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#101628]/85 border border-[#1e2a44] rounded-2xl p-5 shadow-lg space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1c263c]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#8ab4f8]" />
                      <h4 className="font-bold text-[#ededf2] text-sm">
                        Live Scene Timing & Playback Sync
                      </h4>
                    </div>
                    <span className="text-xs text-[#8090ad] font-mono">
                      {SCRIPT_LINES.length} Acts Breakdown
                    </span>
                  </div>

                  <div className="space-y-3">
                    {SCRIPT_LINES.map((line) => {
                      const isSpoken = currentTime >= line.startTime && currentTime < line.endTime;
                      return (
                        <div
                          key={line.id}
                          onClick={() => handleSeekRequest(line.startTime)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSpoken
                              ? 'bg-[#192544] border-[#8ab4f8] shadow-md ring-1 ring-[#8ab4f8]/30'
                              : 'bg-[#0e1424] border-[#1c263c] hover:border-[#2a3c64] hover:bg-[#141d33]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs pb-1">
                            <span className="font-mono text-xs font-semibold text-[#8ab4f8]">
                              Act 0{line.id}: {line.role} ({line.startTime}s - {line.endTime}s)
                            </span>
                            {isSpoken && (
                              <span className="text-[10px] bg-[#8ab4f8] text-[#0a0e1a] px-2 py-0.5 rounded-md font-mono font-bold">
                                PLAYING
                              </span>
                            )}
                          </div>
                          <p className="font-urdu text-lg font-bold text-right text-[#f2f2f8]">
                            {line.urdu}
                          </p>
                          <p className="text-xs text-[#909cb4] mt-1 italic font-sans">
                            "{line.roman}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full 9:16 Video Reel Simulator Focus */}
        {activeTab === 'reel' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-6 lg:col-span-5 flex justify-center">
              <ReelPreview
                currentTime={currentTime}
                duration={duration}
                voiceName={activeVoiceObj.name}
              />
            </div>

            <div className="md:col-span-6 lg:col-span-7 space-y-4">
              <div className="bg-[#101628]/85 border border-[#1e2a44] rounded-2xl p-5 shadow-lg space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c263c]">
                  <ShoppingBag className="w-5 h-5 text-[#8ab4f8]" />
                  <h3 className="font-bold text-[#ededf2] text-base">
                    E-Commerce Ad Deployment & Captions
                  </h3>
                </div>

                <p className="text-xs text-[#95a2bd] leading-relaxed">
                  The generated voice-over audio is perfectly matched with vertical mobile layouts for Daraz Mall, TikTok Ads Manager, Meta Reels (Facebook & Instagram).
                </p>

                <div className="space-y-3">
                  {SCRIPT_LINES.map((line) => {
                    const isSpoken = currentTime >= line.startTime && currentTime < line.endTime;
                    return (
                      <div
                        key={line.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSpoken
                            ? 'bg-[#192544] border-[#8ab4f8] shadow-md ring-1 ring-[#8ab4f8]/30'
                            : 'bg-[#0e1424] border-[#1c263c]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs pb-1">
                          <span className="font-mono text-xs font-semibold text-[#8ab4f8]">
                            Act 0{line.id}: {line.role} ({line.startTime}s - {line.endTime}s)
                          </span>
                          {isSpoken && (
                            <span className="text-[10px] bg-[#8ab4f8] text-[#0a0e1a] px-2 py-0.5 rounded-md font-mono font-bold">
                              SPEAKING
                            </span>
                          )}
                        </div>
                        <p className="font-urdu text-lg font-bold text-right text-[#f2f2f8]">
                          {line.urdu}
                        </p>
                        <p className="text-xs text-[#909cb4] mt-1 italic font-sans">
                          "{line.roman}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Storyboard & Timing */}
        {activeTab === 'storyboard' && (
          <TimelineBreakdown
            currentTime={currentTime}
            onSeek={handleSeekRequest}
          />
        )}

        {/* Tab 4: Product Specs & QC */}
        {activeTab === 'specs' && <SpecsSection />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#1a2338] bg-[#0a0e1a]/85 py-6 text-xs text-[#8090ad] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8ab4f8]"></span>
            <span className="text-[#c0cce0]">D-Kart Voice Studio</span>
            <span className="text-[#405070]">•</span>
            <span>Urdu AI Audio</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#7080a0]">
            <span>Powered by Gemini 3.8 Flash TTS</span>
            <span>•</span>
            <span className="text-[#8ab4f8]">Cosmic Dark Theme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
