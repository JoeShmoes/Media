'use server';
/**
 * @fileOverview A Genkit flow for generating brand voice suggestions.
 *
 * - generateBrandVoice - A function that handles brand voice generation.
 * - GenerateBrandVoiceInput - The input type for the generateBrandVoice function.
 * - GenerateBrandVoiceOutput - The return type for the generateBrandVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { BrandVoice } from '@/lib/types';

const GenerateBrandVoiceInputSchema = z.object({
  businessDescription: z.string().describe('A brief description of the business.'),
});
export type GenerateBrandVoiceInput = z.infer<typeof GenerateBrandVoiceInputSchema>;

const GenerateBrandVoiceOutputSchema = z.object({
  tone: z.string().describe("The suggested tone of voice for the brand (e.g., Confident, direct, and slightly informal)."),
  style: z.string().describe("The suggested writing style for the brand (e.g., Use short sentences. Avoid jargon.)."),
  examples: z.string().describe("Good examples of writing that capture the brand's voice."),
});
export type GenerateBrandVoiceOutput = z.infer<typeof GenerateBrandVoiceOutputSchema>;

export async function generateBrandVoice(input: GenerateBrandVoiceInput): Promise<BrandVoice> {
  return generateBrandVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandVoicePrompt',
  input: {schema: GenerateBrandVoiceInputSchema},
  output: {schema: GenerateBrandVoiceOutputSchema},
  prompt: `You are an expert brand strategist. Based on the following business description, generate a clear and concise brand voice profile.

Business Description: {{{businessDescription}}}

Define a tone of voice, a writing style, and provide a few good examples of copy that exemplify this voice. The examples should be short and punchy.
`,
});

const generateBrandVoiceFlow = ai.defineFlow(
  {
    name: 'generateBrandVoiceFlow',
    inputSchema: GenerateBrandVoiceInputSchema,
    outputSchema: GenerateBrandVoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
