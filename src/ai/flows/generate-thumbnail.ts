
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
  async (input) => {
    
    let promptParts: (string | { text: string } | { media: { url: string } })[] = [];

    if (input.baseImage) {
        // If there's a base image, it's an iteration request.
        promptParts.push({ media: { url: input.baseImage } });
        promptParts.push({ text: `Modify the image based on this new instruction: "${input.prompt}". Maintain a 16:9 aspect ratio and do not add text.` });
    } else {
        // If there's no base image, it's an initial generation request.
        const imagePrompt = `Generate a vibrant and eye-catching 16:9 thumbnail for a YouTube video. The user's request is: "${input.prompt}". Do not include any text in the image.`;
        promptParts.push({ text: imagePrompt });
    }

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation', 
        prompt: promptParts,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_NONE',
                },
                 {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_NONE',
                },
                 {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_NONE',
                },
                 {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_NONE',
                }
            ],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed.');
    }
    
    return { image: media.url };
  }
);
