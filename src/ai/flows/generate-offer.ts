'use server';
/**
 * @fileOverview A Genkit flow for generating offer ideas for a business.
 *
 * - generateOffer - A function that handles the offer generation.
 * - GenerateOfferInput - The input type for the generateOffer function.
 * - GenerateOfferOutput - The return type for the generateOffer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOfferInputSchema = z.object({
  productInfo: z.string().describe('A description of the product or service being offered.'),
  targetAudience: z.string().describe('The target audience for this offer.'),
});
export type GenerateOfferInput = z.infer<typeof GenerateOfferInputSchema>;

const GenerateOfferOutputSchema = z.object({
  title: z.string().describe('A compelling title for the offer.'),
  description: z.string().describe('A concise description of the offer.'),
  price: z.number().describe('A suggested monthly price for the offer.'),
  features: z.array(z.string()).describe('A list of 3-5 key features or deliverables included in the offer.'),
});
export type GenerateOfferOutput = z.infer<typeof GenerateOfferOutputSchema>;

export async function generateOffer(input: GenerateOfferInput): Promise<GenerateOfferOutput> {
  return generateOfferFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOfferPrompt',
  input: {schema: GenerateOfferInputSchema},
  output: {schema: GenerateOfferOutputSchema},
  prompt: `You are an expert business consultant specializing in creating irresistible offers. Based on the product information and target audience, generate a compelling offer.

Product/Service: {{{productInfo}}}
Target Audience: {{{targetAudience}}}

Create an offer with a clear title, a persuasive description, a competitive monthly price, and a list of 3 to 5 powerful features that highlight the value.
`,
});

const generateOfferFlow = ai.defineFlow(
  {
    name: 'generateOfferFlow',
    inputSchema: GenerateOfferInputSchema,
    outputSchema: GenerateOfferOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
