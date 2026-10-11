import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      script,
      voice = 'Kore',
      baseVoice = 'Kore',
      model = 'gemini-3.8-flash-tts',
      style = 'Energetic, friendly, confident, and professional female Pakistani Urdu commercial voice-over artist for Daraz and TikTok e-commerce reels.',
      pace = 'moderately fast',
      targetDuration,
    } = req.body || {};

    const durationDirective =
      targetDuration && targetDuration !== 'auto' && !isNaN(Number(targetDuration)) && Number(targetDuration) > 0
        ? ` Target duration: approximately ${targetDuration} seconds.`
        : '';

    const scriptText =
      script ||
      `اب دفتر ہو یا سفر، کھانا رہے گرم اور تازہ!
پیش ہے الیکٹرک لنچ باکس، جس میں ہے اسٹین لیس اسٹیل کنٹینر اور چالیس واٹ کی ہیٹنگ۔
بس پاور سے کنیکٹ کریں اور اپنے کھانے کو گرم کرنے کی سہولت پائیں۔
آج ہی آرڈر کریں ڈی کارٹ سے!`;

    const validPrebuiltVoices = ['Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'];
    const prebuiltVoiceName = validPrebuiltVoices.includes(baseVoice)
      ? baseVoice
      : validPrebuiltVoices.includes(voice)
      ? voice
      : 'Kore';

    const chosenModel =
      model === 'gemini-3.8-flash-lite-tts' ? 'gemini-3.8-flash-lite-tts' : 'gemini-3.8-flash-tts';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let finalBase64Audio = '';
    let finalModelUsed = chosenModel;
    let fallbackNotice: string | null = null;

    try {
      const response = await ai.models.generateContent({
        model: chosenModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: scriptText,
                speechMetadata: {
                  speaker: prebuiltVoiceName,
                  style: `${style}. Pacing: ${pace}.${durationDirective} Authentic Pakistani Urdu accent and natural flow.`,
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
            finalBase64Audio = part.inlineData.data;
            break;
          }
        }
      }
    } catch (primaryErr: any) {
      const isQuota =
        primaryErr?.message?.includes('429') ||
        primaryErr?.message?.includes('quota') ||
        primaryErr?.message?.includes('RESOURCE_EXHAUSTED');

      if (isQuota && chosenModel === 'gemini-3.8-flash-tts') {
        finalModelUsed = 'gemini-3.8-flash-lite-tts';
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: scriptText,
                  speechMetadata: {
                    speaker: prebuiltVoiceName,
                    style: `${style}. Pacing: ${pace}.${durationDirective} Authentic Pakistani Urdu accent and natural flow.`,
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

        const fallbackParts = fallbackResponse.candidates?.[0]?.content?.parts;
        if (fallbackParts && Array.isArray(fallbackParts)) {
          for (const part of fallbackParts) {
            if (part.inlineData?.data) {
              finalBase64Audio = part.inlineData.data;
              fallbackNotice = 'Auto-switched to Flash-Lite TTS (daily Flash quota reached).';
              break;
            }
          }
        }
      } else {
        throw primaryErr;
      }
    }

    if (!finalBase64Audio) {
      throw new Error('No audio data received in Gemini response');
    }

    return res.status(200).json({
      success: true,
      source: finalModelUsed,
      mimeType: 'audio/wav',
      audioBase64: finalBase64Audio,
      model: finalModelUsed,
      voiceUsed: voice,
      scriptLength: scriptText.length,
      fallbackNotice,
    });
  } catch (error: any) {
    console.error('Vercel API TTS Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error communicating with Gemini TTS service',
    });
  }
}
