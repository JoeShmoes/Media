
'use server';
/**
 * @fileOverview A Genkit flow for generating a YouTube video from a script and images.
 *
 * - generateYoutubeVideo - A function that handles the video generation.
 * - GenerateYoutubeVideoInput - The input type for the generateYoutubeVideo function.
 * - GenerateYoutubeVideoOutput - The return type for the generateYoutubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeVideoInputSchema = z.object({
  script: z.string().describe('The YouTube video script.'),
  audio: z.string().describe("The audio data URI for the voiceover. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
  images: z.array(z.string()).describe("A list of image data URIs. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateYoutubeVideoInput = z.infer<typeof GenerateYoutubeVideoInputSchema>;

const GenerateYoutubeVideoOutputSchema = z.object({
  video: z.string().describe("The generated video as a data URI. Expected format: 'data:video/mp4;base64,<encoded_data>'."),
});
export type GenerateYoutubeVideoOutput = z.infer<typeof GenerateYoutubeVideoOutputSchema>;

export async function generateYoutubeVideo(input: GenerateYoutubeVideoInput): Promise<GenerateYoutubeVideoOutput> {
  return generateYoutubeVideoFlow(input);
}

const generateYoutubeVideoFlow = ai.defineFlow(
  {
    name: 'generateYoutubeVideoFlow',
    inputSchema: GenerateYoutubeVideoInputSchema,
    outputSchema: GenerateYoutubeVideoOutputSchema,
  },
  async ({ script, images, audio }) => {
    
    const promptParts = [
        { text: `Generate a video based on the following script, using the provided images as visual inspiration for the scenes. The provided audio is the voiceover for the entire video. The video's duration should match the audio's duration. Script: ${script}` },
        ...images.map(url => ({ media: { url, contentType: 'image/png' } })),
        { media: { url: audio, contentType: 'audio/wav' } }
    ];
    
    let { operation } = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: promptParts,
        config: {
          aspectRatio: '16:9',
        },
      });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
        // eslint-disable-next-line no-await-in-loop
        operation = await ai.checkOperation(operation);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
        throw new Error(`failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType?.startsWith('video/'));

    if (!videoPart || !videoPart.media || !videoPart.media.url) {
        throw new Error('Failed to find the generated video');
    }

    // The media URL from Veo is a temporary GCS URL, we need to fetch it and convert to a data URI
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to fetch video: ${videoDownloadResponse.statusText}`);
    }
    
    const buffer = await videoDownloadResponse.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');
    
    return {
        video: `data:video/mp4;base64,${base64Video}`,
    };
  }
);
