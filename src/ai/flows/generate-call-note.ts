
'use server';
/**
 * @fileOverview A Genkit flow for generating call notes from raw text.
 *
 * - generateCallNote - A function that handles call note generation.
 * - GenerateCallNoteInput - The input type for the generateCallNote function.
 * - GenerateCallNoteOutput - The return type for the generateCallNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCallNoteInputSchema = z.object({
  clientName: z.string().optional().describe('The name of the client the call was with.'),
  rawNotes: z.string().describe('The raw, unstructured notes or bullet points taken during the call.'),
});
export type GenerateCallNoteInput = z.infer<typeof GenerateCallNoteInputSchema>;

const GenerateCallNoteOutputSchema = z.object({
  summary: z.string().describe("A concise, professional summary of the call."),
  nextActions: z.array(z.string()).describe("A list of 2-4 clear, actionable next steps."),
  emailDraft: z.string().describe("A ready-to-send follow-up email draft based on the call."),
});
export type GenerateCallNoteOutput = z.infer<typeof GenerateCallNoteOutputSchema>;

export async function generateCallNote(input: GenerateCallNoteInput): Promise<GenerateCallNoteOutput> {
  return generateCallNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCallNotePrompt',
  input: {schema: GenerateCallNoteInputSchema},
  output: {schema: GenerateCallNoteOutputSchema},
  prompt: `You are an expert assistant responsible for documenting and summarizing client calls.
Based on the raw notes provided, generate a structured call summary.

{{#if clientName}}
Client: {{{clientName}}}
{{/if}}
Raw Notes:
{{{rawNotes}}}

Your output must include three sections:
1.  **Summary**: A clean, professional summary of the conversation's key points.
2.  **Next Actions**: A clear, numbered list of 2-4 actionable next steps.
3.  **Email Draft**: A friendly but professional follow-up email draft to the client, summarizing the call and confirming the next steps. Address it to the client by name if provided. If not, use a generic greeting.
`,
});

const generateCallNoteFlow = ai.defineFlow(
  {
    name: 'generateCallNoteFlow',
    inputSchema: GenerateCallNoteInputSchema,
    outputSchema: GenerateCallNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
