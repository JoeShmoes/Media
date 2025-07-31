'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized outreach copy, including cold DMs, emails, and phone call scripts, based on lead data.
 *
 * - generateOutreachCopy - A function that generates outreach copy.
 * - GenerateOutreachCopyInput - The input type for the generateOutreachCopy function.
 * - GenerateOutreachCopyOutput - The return type for the generateOutreachCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutreachCopyInputSchema = z.object({
  leadName: z.string().describe('The name of the lead.'),
  leadData: z.string().describe('Additional information about the lead, such as their company, role, and interests.'),
  outreachType: z.enum(['DM', 'Email', 'Phone']).describe('The type of outreach copy to generate.'),
  productDescription: z.string().describe('Description of the product or service being offered.'),
});
export type GenerateOutreachCopyInput = z.infer<typeof GenerateOutreachCopyInputSchema>;

const GenerateOutreachCopyOutputSchema = z.object({
  copy: z.string().describe('The generated outreach copy.'),
});
export type GenerateOutreachCopyOutput = z.infer<typeof GenerateOutreachCopyOutputSchema>;

export async function generateOutreachCopy(input: GenerateOutreachCopyInput): Promise<GenerateOutreachCopyOutput> {
  return generateOutreachCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutreachCopyPrompt',
  input: {schema: GenerateOutreachCopyInputSchema},
  output: {schema: GenerateOutreachCopyOutputSchema},
  prompt: `You are an expert copywriter specializing in creating high-converting outreach copy.

  Based on the lead data and outreach type, generate personalized copy that will resonate with the lead and encourage them to learn more about our product or service.

  Lead Name: {{{leadName}}}
  Lead Data: {{{leadData}}}
  Outreach Type: {{{outreachType}}}
  Product Description: {{{productDescription}}}

  Here's an example of great outreach copy:

  Subject: Quick question for {{leadName}} at {{company}}

  Hi {{leadName}},

  I came across {{company}} while researching companies in the {{industry}} space, and I was impressed with your work in {{specific achievement}}.

  We've developed a new solution that helps companies like yours {{benefit}}.

  Would you be open to a quick call to discuss how we can help?

  Thanks,
  {{yourName}}

  Now generate similar outreach copy:
  `,
});

const generateOutreachCopyFlow = ai.defineFlow(
  {
    name: 'generateOutreachCopyFlow',
    inputSchema: GenerateOutreachCopyInputSchema,
    outputSchema: GenerateOutreachCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
