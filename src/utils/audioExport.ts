/**
 * Audio export utility with Web Audio API OfflineAudioContext resampling.
 * Guarantees that downloaded .WAV files are rendered at the exact chosen playback speed.
 */

export async function exportAudioAtSpeed(
  audioBase64: string,
  mimeType: string,
  speed: number,
  filenamePrefix = 'd-kart-urdu-voiceover',
  voiceName = 'ayesha'
): Promise<void> {
  if (!audioBase64) return;

  const cleanVoiceTag = voiceName
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 20);

  const roundedSpeed = Math.round(speed * 100) / 100;
  const speedLabel = `${roundedSpeed}x`;
  const filename = `${filenamePrefix}-${speedLabel}-${cleanVoiceTag || 'voice'}.wav`;

  // Decode Base64 to ArrayBuffer
  const binaryString = atob(audioBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // If standard 1.0x speed, download original directly
  if (Math.abs(speed - 1.0) < 0.01) {
    const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
    triggerBlobDownload(blob, filename);
    return;
  }

  // Use Web Audio API to decode and resample with OfflineAudioContext at exact speed
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) {
    const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
    triggerBlobDownload(blob, filename);
    return;
  }

  const audioCtx = new AudioCtxClass();
  try {
    const decodedBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));

    // Target duration in sample frames: original length / speed
    const newLength = Math.max(1, Math.ceil(decodedBuffer.length / speed));
    const offlineCtx = new OfflineAudioContext(
      decodedBuffer.numberOfChannels,
      newLength,
      decodedBuffer.sampleRate
    );

    const sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = decodedBuffer;
    sourceNode.playbackRate.value = speed;
    sourceNode.connect(offlineCtx.destination);
    sourceNode.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWavBlob(renderedBuffer);
    triggerBlobDownload(wavBlob, filename);
  } finally {
    try {
      await audioCtx.close();
    } catch {
      // ignore
    }
  }
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Encodes an AudioBuffer to standard 16-bit PCM RIFF WAV format
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const blockAlign = numChannels * (bitDepth / 8);
  const byteRate = sampleRate * blockAlign;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true); // AudioFormat PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels and write 16-bit PCM samples
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i];
      // Clamp between -1.0 and 1.0
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}
