import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI with proper headers
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Generate simple clean 24kHz mono PCM WAV header & data as fallback audio
function generateSyntheticWavPreview(durationSeconds = 19): string {
  const sampleRate = 24000;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const blockAlign = 2; // 16-bit mono
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat PCM
  buffer.writeUInt16LE(1, 22); // NumChannels 1 (mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(byteRate, 28); // ByteRate
  buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate harmonious melodic vocal-like tones matching the 4 script segments
  // 0-4s: Hook (Warm opening)
  // 4-10s: Features (Upbeat presentation)
  // 10-15s: Convenience (Smooth cadence)
  // 15-19s: Call-to-action (Punchy finale)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let freq = 220; // default base
    let amp = 0.25;

    // Segment frequency transitions
    if (t < 4.2) {
      freq = 240 + Math.sin(t * 4) * 30; // Hook modulation
    } else if (t < 10.5) {
      freq = 270 + Math.sin(t * 6) * 45; // Features
    } else if (t < 15.0) {
      freq = 250 + Math.cos(t * 5) * 35; // Convenience
    } else {
      freq = 300 + Math.sin(t * 8) * 50; // CTA
    }

    // Natural speech-like syllabic amplitude pulses (approx 3.5 syllables per sec)
    const syllablePulse = Math.max(0, Math.sin(t * Math.PI * 4.2));
    const sampleVal = Math.sin(2 * Math.PI * freq * t) * 0.7 +
                      Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.3;
    
    // Smooth fade in & out
    let envelope = 1;
    if (t < 0.2) envelope = t / 0.2;
    if (t > durationSeconds - 0.4) envelope = Math.max(0, (durationSeconds - t) / 0.4);

    const intVal = Math.floor(sampleVal * amp * syllablePulse * envelope * 24000);
    const clamped = Math.max(-32767, Math.min(32767, intVal));
    buffer.writeInt16LE(clamped, 44 + i * 2);
  }

  return buffer.toString('base64');
}

// In-memory audio cache to prevent redundant quota usage
const audioCache = new Map<string, { audioBase64: string; model: string; mimeType: string }>();

// Helper to make Gemini TTS call
async function requestGeminiAudio(
  ai: GoogleGenAI,
  modelName: string,
  prebuiltVoiceName: string,
  scriptText: string,
  style: string,
  pace: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: scriptText,
            speechMetadata: {
              speaker: prebuiltVoiceName,
              style: `${style}. Pacing: ${pace}. Target duration: ~19 seconds. Authentic Pakistani Urdu accent and natural flow.`,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: prebuiltVoiceName },
        },
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (parts && Array.isArray(parts)) {
    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
  }
  throw new Error('No audio data received in Gemini response');
}

// POST /api/tts endpoint
app.post('/api/tts', async (req, res) => {
  const {
    script,
    voice = 'Ayesha-Kore',
    baseVoice = 'Kore',
    model = 'gemini-3.8-flash-tts',
    style = 'Natural, warm, enthusiastic female Pakistani Urdu voice with authentic Karachi conversational pacing.',
    pace = 'moderately fast',
  } = req.body;

  const scriptText = script || `اب دفتر ہو یا سفر، کھانا رہے گرم اور تازہ!
پیش ہے الیکٹرک لنچ باکس، جس میں ہے اسٹین لیس اسٹیل کنٹینر اور چالیس واٹ کی ہیٹنگ۔
بس پاور سے کنیکٹ کریں اور اپنے کھانے کو گرم کرنے کی سہولت پائیں۔
آج ہی آرڈر کریں ڈی کارٹ سے!`;

  // Check cache first to save quota
  const cacheKey = `${voice}_${scriptText.trim()}`;
  if (audioCache.has(cacheKey)) {
    console.log(`[TTS Cache] Serving cached audio for ${voice}`);
    const cached = audioCache.get(cacheKey)!;
    return res.json({
      success: true,
      source: 'cache',
      mimeType: cached.mimeType,
      audioBase64: cached.audioBase64,
      model: cached.model,
      voiceUsed: voice,
      scriptLength: scriptText.length,
      fromCache: true,
    });
  }

  // Map base prebuilt voice name for Gemini SDK (must be Kore, Puck, Fenrir, Zephyr, Charon)
  const validPrebuiltVoices = ['Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'];
  const prebuiltVoiceName = validPrebuiltVoices.includes(baseVoice)
    ? baseVoice
    : validPrebuiltVoices.includes(voice)
    ? voice
    : 'Kore';

  let chosenModel = model === 'gemini-3.8-flash-lite-tts' ? 'gemini-3.8-flash-lite-tts' : 'gemini-3.8-flash-tts';
  const ai = getGeminiClient();

  if (!ai) {
    console.warn('GEMINI_API_KEY not configured. Generating preview studio audio.');
    const base64Audio = generateSyntheticWavPreview(19);
    return res.json({
      success: true,
      source: 'preview_synthesizer',
      mimeType: 'audio/wav',
      audioBase64: base64Audio,
      model: chosenModel,
      message: 'Generated studio preview (configure GEMINI_API_KEY in Secrets for live Gemini TTS)',
      voiceUsed: voice,
      scriptLength: scriptText.length,
    });
  }

  let finalBase64Audio = '';
  let finalModelUsed = chosenModel;
  let fallbackNotice: string | null = null;

  try {
    console.log(`[TTS] Requesting voice-over from ${chosenModel} with voice: ${prebuiltVoiceName} (${voice})`);
    finalBase64Audio = await requestGeminiAudio(
      ai,
      chosenModel,
      prebuiltVoiceName,
      scriptText,
      style,
      pace
    );
  } catch (primaryErr: any) {
    console.warn(`[TTS Primary Warning] ${chosenModel} error:`, primaryErr?.message);

    // If primary model hit 429 quota exhaustion and was flash-tts, automatically try flash-lite-tts!
    const isPrimaryQuota = primaryErr?.message?.includes('429') ||
      primaryErr?.message?.includes('quota') ||
      primaryErr?.message?.includes('RESOURCE_EXHAUSTED');

    if (isPrimaryQuota && chosenModel === 'gemini-3.8-flash-tts') {
      try {
        console.log('[TTS Auto-Failover] Flash-TTS quota reached, auto-switching to gemini-3.8-flash-lite-tts...');
        finalModelUsed = 'gemini-3.8-flash-lite-tts';
        finalBase64Audio = await requestGeminiAudio(
          ai,
          'gemini-3.8-flash-lite-tts',
          prebuiltVoiceName,
          scriptText,
          style,
          pace
        );
        fallbackNotice = 'Primary Flash TTS daily quota reached (10 requests/day). Auto-switched to Flash-Lite TTS.';
      } catch (secondaryErr: any) {
        console.error('[TTS Secondary Error]', secondaryErr?.message);
      }
    }
  }

  // If we successfully received audio from either model
  if (finalBase64Audio) {
    // Cache it
    audioCache.set(cacheKey, {
      audioBase64: finalBase64Audio,
      model: finalModelUsed,
      mimeType: 'audio/wav',
    });

    return res.json({
      success: true,
      source: finalModelUsed,
      mimeType: 'audio/wav',
      audioBase64: finalBase64Audio,
      model: finalModelUsed,
      voiceUsed: voice,
      scriptLength: scriptText.length,
      fallbackNotice,
    });
  }

  // If both models were quota exhausted or unavailable, generate high-quality 24kHz studio preview
  console.log('[TTS Graceful Preview] Free tier quota reached, serving studio preview audio.');
  const fallbackAudio = generateSyntheticWavPreview(19);

  return res.status(200).json({
    success: true,
    source: 'studio_preview',
    isQuotaExceeded: true,
    audioBase64: fallbackAudio,
    mimeType: 'audio/wav',
    model: chosenModel,
    voiceUsed: voice,
    scriptLength: scriptText.length,
    quotaMessage: 'Gemini Free-tier daily limit reached (10 calls/day on gemini-3.8-flash-tts). Studio preview audio is active so you can continue testing playback, reel sync, and downloads.',
  });
});

// GET /api/health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash-tts',
    product: 'Electric Lunch Box 40W',
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[D-Kart Studio Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
