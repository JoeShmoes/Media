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
  length: z.enum(["Short", "Long"]).describe("The desired length of the message.")
});
export type GenerateOutreachCopyInput = z.infer<typeof GenerateOutreachCopyInputSchema>;

const GenerateOutreachCopyOutputSchema = z.object({
  subject: z.string().optional().describe('The generated subject line, if applicable (for emails).'),
  body: z.string().describe('The generated outreach message body or script.'),
});
export type GenerateOutreachCopyOutput = z.infer<typeof GenerateOutreachCopyOutputSchema>;

export async function generateOutreachCopy(input: GenerateOutreachCopyInput): Promise<GenerateOutreachCopyOutput> {
  return generateOutreachCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutreachCopyPrompt',
  input: {schema: GenerateOutreachCopyInputSchema},
  output: {schema: GenerateOutreachCopyOutputSchema},
  prompt: `You are an expert copywriter specializing in creating high-converting, human-sounding outreach copy. Your tone should be professional, confident, and direct, but not overly flattering or sycophantic. Avoid "glazing" the lead with excessive praise.

  Generate a personalized outreach message based on the following details.

  **Lead Details:**
  - Name: {{{leadName}}}
  - Background Info: {{{leadData}}}

  **Outreach Details:**
  - Type: {{{outreachType}}}
  - Message Length: {{{length}}}
  - Product/Service: {{{productDescription}}}

  **Instructions:**
  1.  **Be Human:** Write in a natural, conversational tone. Avoid overly formal or robotic language.
  2.  **Be Professional:** The goal is to start a business relationship, so maintain a respectful tone.
  3.  **Avoid Excessive Praise:** Reference the lead's work or achievements if relevant, but do so concisely and genuinely. Do not "waffle" or "glaze." The focus should be on providing value.
  4.  **Subject Line (for Emails):** If the outreach type is 'Email', create a compelling, short, and personalized subject line. Do not include "Subject:" in the output. If the type is not 'Email', the subject field should be empty.
  5.  **Message Length:** Adhere to the requested length.
      - **Short:** A brief, concise message, typically 2-3 sentences. Perfect for a quick DM or initial contact.
      - **Long:** A more detailed message, typically 2-3 paragraphs, providing more context.
  6.  **Call to Action:** End with a clear, low-friction call to action.

  Generate the outreach copy now.
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
