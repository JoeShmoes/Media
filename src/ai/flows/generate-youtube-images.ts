
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
  style: z.string().optional().describe('The artistic style for the image (e.g., cinematic, realistic, minimalist).'),
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
  async ({ paragraph, prompt, style }) => {
    const imageGenerationPrompt = prompt || `Generate a ${style || 'cinematic and realistic'} image for the following scene: ${paragraph}`;
    
    // Generate 3 images in parallel
    const imagePromises = Array(3).fill(null).map(() => 
      ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: imageGenerationPrompt,
          config: {
              responseModalities: ['TEXT', 'IMAGE'],
          },
      })
    );

    const results = await Promise.all(imagePromises);
    
    const images: string[] = results.map(result => {
        if (result.media?.url) {
            return result.media.url;
        }
        return null;
    }).filter((img): img is string => img !== null);
    
    if (images.length === 0) {
        throw new Error('All image generation attempts failed for the paragraph.');
    }

    return { images };
  }
);
