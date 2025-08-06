
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

const thumbnailPromptRefiner = ai.definePrompt({
    name: 'thumbnailPromptRefiner',
    input: { schema: GenerateThumbnailInputSchema },
    output: { schema: z.string() },
    prompt: `You are an expert prompt engineer specializing in creating amazing YouTube thumbnails. 
    Refine the following user request into a detailed, descriptive prompt for an image generation model.
    Make sure to incorporate the specific style and elements requested by the user.

    User Request: {{{prompt}}}
    {{#if baseImage}}
    Base Image for Iteration: {{media url=baseImage}}
    {{/if}}

    Refined Prompt:`,
});

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async (input) => {
    // Step 1: Refine the user's prompt for better image generation results.
    const refinedPromptResult = await thumbnailPromptRefiner(input);
    const refinedPrompt = refinedPromptResult.output;

    if (!refinedPrompt) {
        throw new Error('Failed to refine the thumbnail prompt.');
    }

    // Step 2: Generate the image using the refined prompt.
    const { media } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest', 
        prompt: refinedPrompt,
        config: {
            // Updated config for the new model
            output: {
                format: 'jpeg', // or 'png'
            },
            aspectRatio: "16:9",
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
