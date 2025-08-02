
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


const GenerateYoutubeAudioInputSchema = z.object({
  script: z.string().describe('The script to convert to audio.'),
});
export type GenerateYoutubeAudioInput = z.infer<typeof GenerateYoutubeAudioInputSchema>;

const GenerateYoutubeAudioOutputSchema = z.object({
  audio: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/mp3;base64,<encoded_data>'."),
});
export type GenerateYoutubeAudioOutput = z.infer<typeof GenerateYoutubeAudioOutputSchema>;

export async function generateYoutubeAudio(input: GenerateYoutubeAudioInput): Promise<GenerateYoutubeAudioOutput> {
  return generateYoutubeAudioFlow(input);
}


const generateYoutubeAudioFlow = ai.defineFlow(
  {
    name: 'generateYoutubeAudioFlow',
    inputSchema: GenerateYoutubeAudioInputSchema,
    outputSchema: GenerateYoutubeAudioOutputSchema,
  },
  async ({script}) => {
    const { media } = await ai.generate({
        model: 'googleai/tts-1',
        prompt: script,
        config: {
          voice: 'alloy',
          responseFormat: 'mp3',
        },
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from the model.');
    }
    
    // The model returns a data URI with base64 encoded MP3 data.
    // We just need to ensure the mime type is correct.
    const base64Audio = media.url.split(',')[1];

    return {
      audio: `data:audio/mp3;base64,${base64Audio}`,
    };
  }
);
