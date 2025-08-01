'use server';
/**
 * @fileOverview A Genkit flow for generating images for a YouTube script.
 *
 * - generateYoutubeImages - A function that handles the image generation for a script paragraph.
 * - GenerateYoutubeImagesInput - The input type for the generateYoutubeImages function.
 * - GenerateYoutubeImagesOutput - The return type for the generateYoutubeImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeImagesInputSchema = z.object({
  paragraph: z.string().describe('A paragraph from the YouTube script.'),
  prompt: z.string().optional().describe('An optional custom prompt for image generation. If not provided, the paragraph will be used as the prompt.'),
});
export type GenerateYoutubeImagesInput = z.infer<typeof GenerateYoutubeImagesInputSchema>;

const GenerateYoutubeImagesOutputSchema = z.object({
  images: z.array(z.string()).describe("A list of generated image data URIs. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateYoutubeImagesOutput = z.infer<typeof GenerateYoutubeImagesOutputSchema>;

export async function generateYoutubeImages(input: GenerateYoutubeImagesInput): Promise<GenerateYoutubeImagesOutput> {
  return generateYoutubeImagesFlow(input);
}

const generateYoutubeImagesFlow = ai.defineFlow(
  {
    name: 'generateYoutubeImagesFlow',
    inputSchema: GenerateYoutubeImagesInputSchema,
    outputSchema: GenerateYoutubeImagesOutputSchema,
  },
  async ({ paragraph, prompt }) => {
    const imageGenerationPrompt = prompt || `Generate a realistic and cinematic image for the following scene: ${paragraph}`;
    
    const imagePromises = Array(3).fill(null).map(async () => {
      try {
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: imageGenerationPrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        return media?.url || null;
      } catch (error) {
        console.error("Image generation for a paragraph failed:", error);
        return null; // Return null if an individual image generation fails
      }
    });

    const results = await Promise.all(imagePromises);
    const images = results.filter((url): url is string => url !== null);
    
    if (images.length === 0) {
        // If all image generations failed, we can either throw an error or return an empty array.
        // Let's throw an error to make it clear that the step failed completely.
        throw new Error('All image generation attempts failed for a paragraph.');
    }

    return { images };
  }
);
