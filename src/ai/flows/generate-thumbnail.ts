
'use server';
/**
 * @fileOverview A Genkit flow for generating YouTube thumbnails.
 *
 * - generateThumbnail - A function that handles thumbnail generation.
 * - GenerateThumbnailInput - The input type for the generateThumbnail function.
 * - GenerateThumbnailOutput - The return type for the generateThumbnail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailInputSchema = z.object({
  prompt: z.string().describe('The user prompt describing the desired thumbnail.'),
  baseImage: z.string().optional().describe("An optional base image as a data URI to iterate upon. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

const GenerateThumbnailOutputSchema = z.object({
  image: z.string().describe("The generated thumbnail image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  return generateThumbnailFlow(input);
}

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async ({ prompt, baseImage }) => {
    
    const imageGenerationPrompt = baseImage 
      ? [{ media: { url: baseImage } }, { text: prompt }]
      : [{ text: prompt }];

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: imageGenerationPrompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            // Specific config for thumbnails
            aspectRatio: "16:9",
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed.');
    }
    
    return { image: media.url };
  }
);
