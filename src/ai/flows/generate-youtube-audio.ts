'use server';
/**
 * @fileOverview A Genkit flow for generating audio from text using TTS.
 *
 * - generateYoutubeAudio - A function that handles the audio generation.
 * - GenerateYoutubeAudioInput - The input type for the generateYoutubeAudio function.
 * - GenerateYoutubeAudioOutput - The return type for the generateYoutubeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateYoutubeAudioInputSchema = z.object({
  script: z.string().describe('The script to convert to audio.'),
});
export type GenerateYoutubeAudioInput = z.infer<typeof GenerateYoutubeAudioInputSchema>;

const GenerateYoutubeAudioOutputSchema = z.object({
  audio: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateYoutubeAudioOutput = z.infer<typeof GenerateYoutubeAudioOutputSchema>;

export async function generateYoutubeAudio(input: GenerateYoutubeAudioInput): Promise<GenerateYoutubeAudioOutput> {
  return generateYoutubeAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateYoutubeAudioFlow = ai.defineFlow(
  {
    name: 'generateYoutubeAudioFlow',
    inputSchema: GenerateYoutubeAudioInputSchema,
    outputSchema: GenerateYoutubeAudioOutputSchema,
  },
  async ({script}) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: script,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from the model.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audio: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
