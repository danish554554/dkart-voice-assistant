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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Studio Navbar */}
      <Navbar
        onQuickGenerate={() => generateVoiceOver()}
        isGenerating={isGenerating}
        modelName={selectedModel}
        voiceName={activeVoiceObj.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Universal Studio Header Banner (Black background with white writing and white button-style cards with black text) */}
        <div className="relative overflow-hidden rounded-3xl bg-black border border-zinc-900 p-6 sm:p-8 shadow-md">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Mic className="w-3.5 h-3.5 text-black" />
                  Voice: {activeVoiceObj.name} • {activeVoiceObj.accent}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
                  Commercial Studio
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white text-black font-mono text-xs font-semibold shadow-sm">
                  Model: {selectedModel}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold">
                  {playbackRate}x Export Speed
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Pakistani Urdu Voice-Over Studio
                <span className="block text-zinc-400 font-bold">
                  AI Commercial & Social Reels Production
                </span>
              </h1>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Universal studio-grade Urdu text-to-speech for any e-commerce product, Daraz campaign, TikTok ads, or Instagram reels. Featuring native Pakistani regional accents (Karachi, Lahore, Islamabad, Influencer, FM Radio) powered by Google Gemini TTS.
              </p>
            </div>

            {/* Studio Capabilities Overview (White Buttons with Black Text) */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 text-xs">
              <div className="p-3.5 rounded-2xl bg-white text-black shadow-md border border-white hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-1.5 text-black font-extrabold mb-1">
                  <Flame className="w-4 h-4 text-black" />
                  <span>Gemini 3.8 TTS</span>
                </div>
                <p className="text-zinc-600 text-[11px] font-medium">24kHz Broadcast Audio</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white text-black shadow-md border border-white hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-1.5 text-black font-extrabold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>5+ Native Accents</span>
                </div>
                <p className="text-zinc-600 text-[11px] font-medium">Karachi, Lahore, Capital</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white text-black shadow-md border border-white hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-1.5 text-black font-extrabold mb-1">
                  <Zap className="w-4 h-4 text-black" />
                  <span>0.5x – 2.0x Speed</span>
                </div>
                <p className="text-zinc-600 text-[11px] font-medium">Exact .WAV Export Render</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white text-black shadow-md border border-white hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-1.5 text-black font-extrabold mb-1">
                  <Clock className="w-4 h-4 text-black" />
                  <span>9:16 Video Sync</span>
                </div>
                <p className="text-zinc-600 text-[11px] font-medium">Daraz & TikTok Mockup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {statusMessage && !errorMessage && (
          <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Source: {source}
            </span>
          </div>
        )}

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Commercial Voice Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('reel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reel'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Reel & Daraz Mockup</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'storyboard'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Storyboard & Timing</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Product Tech Sheet & QC</span>
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
                <div className="w-full bg-white border border-zinc-200 rounded-3xl p-5 flex flex-col items-center shadow-sm">
                  <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900">
                        Live 9:16 Ad Reel Visualizer
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      Sync: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
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
                <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-zinc-900" />
                      <h4 className="font-bold text-zinc-900 text-sm">
                        Live Scene Timing & Playback Sync
                      </h4>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">
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
                              ? 'bg-zinc-100 border-black ring-1 ring-black shadow-sm'
                              : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs pb-1">
                            <span className="font-bold text-zinc-900">
                              Act 0{line.id}: {line.role} ({line.startTime}s - {line.endTime}s)
                            </span>
                            {isSpoken && (
                              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                                SPEAKING NOW
                              </span>
                            )}
                          </div>
                          <p className="font-urdu text-lg font-bold text-right text-zinc-950">
                            {line.urdu}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1 italic">
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
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-200">
                  <ShoppingBag className="w-5 h-5 text-zinc-900" />
                  <h3 className="font-bold text-zinc-900 text-base">
                    E-Commerce Ad Deployment & Captions
                  </h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  The generated voice-over audio is perfectly matched with vertical mobile layouts for Daraz Mall, TikTok Ads Manager, Meta Reels (Facebook & Instagram).
                </p>

                <div className="space-y-3">
                  {SCRIPT_LINES.map((line, idx) => {
                    const isSpoken = currentTime >= line.startTime && currentTime < line.endTime;
                    return (
                      <div
                        key={line.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSpoken
                            ? 'bg-zinc-100 border-black shadow-sm'
                            : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs pb-1">
                          <span className="font-bold text-zinc-900">
                            Act 0{line.id}: {line.role} ({line.startTime}s - {line.endTime}s)
                          </span>
                          {isSpoken && (
                            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                              NOW SPEAKING
                            </span>
                          )}
                        </div>
                        <p className="font-urdu text-lg font-bold text-right text-zinc-950">
                          {line.urdu}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 italic">
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
      <footer className="mt-12 border-t border-zinc-200 bg-white py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span>D-Kart E-Commerce Media Studio • Commercial Voice-Over</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Powered by Google Gemini 3.8 Flash TTS</span>
            <span>•</span>
            <span>Pakistani Urdu Native Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
