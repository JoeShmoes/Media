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
  outreachType: z.enum(['DM', 'Email', 'Phone', 'Follow Up']).describe('The type of outreach copy to generate.'),
  productDescription: z.string().describe('Description of the product or service being offered.'),
  length: z.enum(["Short", "Long"]).describe("The desired length of the message."),
  userContext: z.string().optional().describe("Background context about the user sending the message."),
  userName: z.string().describe("The name of the user sending the message.")
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
  prompt: `You are an expert copywriter specializing in creating high-converting, human-sounding outreach copy. Your tone should be professional, confident, and direct. Your main goal is to get a response, focusing on the prospect's problems and how you can solve them.

  **Core Principles:**
  1.  **Focus on Results**: The prospect cares about the results you can get them, not your expertise. Frame everything around solving their problem.
  2.  **Agitate the Problem**: First, identify the prospect's core problem. Then, explain why the 3 most common solutions (e.g., doing it themselves, hiring someone, or using a generic firm) won't work for them, highlighting issues like time, specialization, and lack of personalized service. This builds urgency.
  3.  **Present Your Unique Solution**: After showing why other options fail, introduce the user's service as the only logical solution. Emphasize scarcity (e.g., "I only work with 5 clients at a time") and a shared-risk model ("We win when you win").
  4.  **Human Tone (The Bar Test)**: Write as if you were speaking to someone in a bar. Use natural, varied sentence structures. Read your message out loud to ensure it doesn't sound robotic. Avoid waffling or using filler words.
  5.  **No "Glazing"**: Do not use excessive praise. Be respectful but direct.
  6.  **No Generic Openings**: For 'Long' emails, do NOT start with "I hope this message finds you well." Get straight to the point.
  7.  **Simple Subject Line**: For 'Email' outreach, the subject line should be simple and direct (e.g., "Clients", "Question", or about their niche). Avoid salesy language. If not an email, or if it's a Follow Up, the subject should be empty.
  8.  **Clear Call to Action**: The goal is to start a conversation, not to close a deal on the first message. End with a low-friction question like "Is this something that interests you?"
  9.  **Professional Sign-off**: End the message with "Sincerely," or "--", followed by the user's name: {{{userName}}}.

  **Input Details:**
  - Lead Name: {{{leadName}}}
  - Lead Background: {{{leadData}}}
  - My Name: {{{userName}}}
  - My Context/Background: {{{userContext}}}
  - Product/Service: {{{productDescription}}}
  - Outreach Type: {{{outreachType}}}
  - Message Length: {{{length}}}

  **Instructions:**
  
  *   **If outreachType is 'Follow Up'**: Use the following strict template. This is for when someone has not responded to a previous message.
      1.  Quick follow up.
      2.  Did you get a chance to look at this?

  *   **If Length is 'Short' and outreachType is NOT 'Follow Up'**: Use the following strict template. This is for quick, initial DMs or emails.
      1.  Hi, {{{leadName}}},
      2.  I found your [Lead's Business Type from leadData] while looking for [Lead's Niche from leadData] in [Lead's Location from leadData].
      3.  I help [Their Niche] easily attract more clients, would that be an interest to you?
      4.  --
      5.  {{{userName}}}

  *   **If Length is 'Long' and outreachType is NOT 'Follow Up'**: Write a more detailed message (2-3 paragraphs) following the **Core Principles** above. Agitate their problem, explain why common solutions fail, and present your service as the unique, specialized answer.

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
