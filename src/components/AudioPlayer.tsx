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

import { exportAudioAtSpeed } from '../utils/audioExport';

interface AudioPlayerProps {
  audioBase64: string | null;
  mimeType: string;
  source: string;
  model: string;
  voiceUsed: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSeekRequest?: (time: number) => void;
  targetDuration?: number;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType,
  source,
  model,
  voiceUsed,
  onTimeUpdate,
  targetDuration = 19,
  playbackRate = 1.0,
  onPlaybackRateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(targetDuration);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [internalRate, setInternalRate] = useState<number>(playbackRate);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Sync internal playback rate with prop
  useEffect(() => {
    setInternalRate(playbackRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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
    setInternalRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    if (onPlaybackRateChange) {
      onPlaybackRateChange(rate);
    }
  };

  const handleDownload = async () => {
    if (!audioBase64 || isExporting) return;
    setIsExporting(true);
    try {
      await exportAudioAtSpeed(
        audioBase64,
        mimeType,
        internalRate,
        'd-kart-urdu-commercial',
        voiceUsed
      );
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setIsExporting(false);
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
    <div className="bg-[#181820] border border-[#2b2b3c] rounded-2xl p-5 shadow-xl text-[#e2e2e8]">
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252535]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#22222f] border border-[#303042] flex items-center justify-center text-[#8ab4f8]">
            <Radio className="w-5 h-5 animate-pulse text-[#8ab4f8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#f2f2f8] text-sm sm:text-base">
                Urdu Commercial Voice-Over Master
              </h3>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#20202e] text-[#8ab4f8] border border-[#323245]">
                BROADCAST READY
              </span>
            </div>
            <p className="text-xs text-[#808092]">
              Voice: <span className="text-white font-medium">{voiceUsed}</span> • Format: 24kHz Unary WAV (16-Bit) • Model: <span className="font-mono text-[#8ab4f8]">{model}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {audioBase64 && (
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8ab4f8] hover:bg-[#9bc0fa] text-[#0e0e11] font-mono text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
              title={`Download audio rendered at ${internalRate}x speed`}
            >
              {isExporting ? (
                <Sparkles className="w-3.5 h-3.5 text-[#0e0e11] animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#0e0e11]" />
              )}
              <span>{isExporting ? 'Exporting...' : `Download .WAV (${internalRate}x)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="py-4">
        <div className="h-16 flex items-center justify-between gap-1 px-3 bg-[#121218] border border-[#252535] rounded-xl overflow-hidden relative">
          {/* Target 19s marker overlay */}
          <div className="absolute right-4 top-1.5 flex items-center gap-1 text-[10px] font-mono text-[#8ab4f8] bg-[#1a1a24] px-2 py-0.5 rounded border border-[#2e2e40] z-10 shadow-xs">
            <Clock className="w-3 h-3 text-[#8ab4f8]" />
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
                      ? 'bg-[#8ab4f8] shadow-sm shadow-[#8ab4f8]/30'
                      : 'bg-[#252535] group-hover:bg-[#35354a]'
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
            className="w-full h-2 bg-[#252535] rounded-lg appearance-none cursor-pointer accent-[#8ab4f8] disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#808092]">
          <div className="flex items-center gap-1.5 text-[#8ab4f8] font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            {targetDuration && targetDuration > 0 && (
              <span className="text-[#606072]">
                target: {targetDuration.toFixed(2)}s
              </span>
            )}
            <span className="text-[#c0c0d2] font-medium">
              / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="mt-4 pt-4 border-t border-[#252535] flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={!audioBase64}
            className="w-12 h-12 rounded-xl bg-[#8ab4f8] hover:bg-[#9bc0fa] text-[#0e0e11] flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play voice-over'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-[#0e0e11]" />
            ) : (
              <Play className="w-5 h-5 fill-[#0e0e11] ml-0.5" />
            )}
          </button>

          <button
            onClick={handleRestart}
            disabled={!audioBase64}
            className="w-10 h-10 rounded-xl bg-[#1c1c27] hover:bg-[#252535] text-[#8ab4f8] flex items-center justify-center border border-[#2d2d3e] active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-[#121218] border border-[#252535] rounded-xl p-0.5 text-xs font-mono">
            {[0.8, 1.0, 1.2, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  internalRate === rate
                    ? 'bg-[#8ab4f8] text-[#0e0e11] shadow-xs'
                    : 'text-[#808092] hover:text-white'
                }`}
                title={`Play & download audio at ${rate}x speed`}
              >
                {rate === 1.0 ? '1x' : `${rate}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Details */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#808092] hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#8ab4f8]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-[#252535] rounded-lg appearance-none cursor-pointer accent-[#8ab4f8]"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#808092] border-l border-[#252535] pl-3 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#8ab4f8]"></span>
            <span>Profile:</span>
            <span className="text-[#e2e2ea] font-medium">{voiceUsed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
