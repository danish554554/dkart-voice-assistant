import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Gauge,
  Sparkles,
  Radio,
  Clock,
  Layers,
} from 'lucide-react';

interface AudioPlayerProps {
  audioBase64: string | null;
  mimeType: string;
  source: string;
  model: string;
  voiceUsed: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSeekRequest?: (time: number) => void;
  targetDuration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType,
  source,
  model,
  voiceUsed,
  onTimeUpdate,
  targetDuration = 19,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(targetDuration);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Set audio source when audioBase64 changes
  useEffect(() => {
    if (audioRef.current && audioBase64) {
      const audioUrl = `data:${mimeType || 'audio/wav'};base64,${audioBase64}`;
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioBase64, mimeType]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Audio playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || targetDuration;
    setCurrentTime(cur);
    if (!isNaN(dur) && isFinite(dur)) {
      setDuration(dur);
    }
    if (onTimeUpdate) {
      onTimeUpdate(cur, dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (!isNaN(dur) && isFinite(dur)) {
      setDuration(dur);
      if (onTimeUpdate) {
        onTimeUpdate(0, dur);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleDownload = () => {
    if (!audioBase64) return;
    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanVoiceTag = voiceUsed.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
      a.download = `d-kart-electric-lunchbox-urdu-voiceover-19s-${cleanVoiceTag.toLowerCase() || 'female'}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs - s) * 10);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}.${ms}`;
  };

  // Generate synthetic waveform bars (36 bars)
  const barHeights = [
    25, 45, 60, 30, 75, 90, 85, 40, 65, 80, 50, 95, 70, 85, 45, 30, 60, 90, 100,
    75, 60, 85, 95, 40, 55, 70, 85, 60, 90, 75, 50, 65, 80, 45, 30, 20,
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40">
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Urdu Commercial Voice-Over Master
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Broadcast Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Voice: <span className="text-amber-300 font-medium">{voiceUsed}</span> • Format: 24kHz Unary WAV (Mono 16-Bit) • Model: <span className="font-mono text-slate-300">{model}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {audioBase64 && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Download Master WAV Audio File"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download .WAV</span>
            </button>
          )}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="py-4">
        <div className="h-16 flex items-center justify-between gap-1 px-2 bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-hidden relative">
          {/* Target 19s marker overlay */}
          <div className="absolute right-4 top-1.5 flex items-center gap-1 text-[10px] font-mono text-amber-400/80 bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-500/20 z-10">
            <Clock className="w-3 h-3" />
            <span>Target: 19.0s</span>
          </div>

          {barHeights.map((h, idx) => {
            const barProgress = idx / barHeights.length;
            const currentProgress = duration > 0 ? currentTime / duration : 0;
            const isPassed = barProgress <= currentProgress;

            // Height scaling when playing
            const dynamicScale = isPlaying
              ? Math.sin(idx * 0.4 + currentTime * 6) * 15 + h
              : h;
            const clampedH = Math.max(15, Math.min(100, dynamicScale));

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col justify-center items-center h-full cursor-pointer group"
                onClick={() => {
                  const targetTime = barProgress * duration;
                  if (audioRef.current) {
                    audioRef.current.currentTime = targetTime;
                  }
                  setCurrentTime(targetTime);
                }}
              >
                <div
                  style={{ height: `${clampedH}%` }}
                  className={`w-full max-w-[6px] rounded-full transition-all duration-75 ${
                    isPassed
                      ? 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-xs shadow-amber-500/50'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="range"
            min={0}
            max={duration || targetDuration}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            disabled={!audioBase64}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">
              Commercial Target: 19.00s
            </span>
            <span className="text-slate-300 font-medium">
              / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={!audioBase64}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play voice-over'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleRestart}
            disabled={!audioBase64}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-medium">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Details */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Studio Voice Profile:</span>
            <span className="text-slate-200 font-semibold">{voiceUsed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
