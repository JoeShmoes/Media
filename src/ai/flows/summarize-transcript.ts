
'use server';
/**
 * @fileOverview A Genkit flow for summarizing meeting transcripts.
 *
 * - summarizeTranscript - A function that handles transcript summarization.
 * - SummarizeTranscriptInput - The input type for the summarizeTranscript function.
 * - SummarizeTranscriptOutput - The return type for the summarizeTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTranscriptInputSchema = z.object({
  clientName: z.string().optional().describe('The name of the client or project the meeting was about.'),
  transcript: z.string().describe('The full text transcript of the meeting.'),
});
export type SummarizeTranscriptInput = z.infer<typeof SummarizeTranscriptInputSchema>;

const SummarizeTranscriptOutputSchema = z.object({
  title: z.string().describe("A concise title for the meeting summary."),
  keyDecisions: z.array(z.string()).describe("A list of key decisions made during the meeting."),
  actionItems: z.array(z.string()).describe("A list of actionable next steps, with assigned owners if mentioned."),
  concerns: z.array(z.string()).describe("A list of any concerns or risks raised during the discussion."),
});
export type SummarizeTranscriptOutput = z.infer<typeof SummarizeTranscriptOutputSchema>;

export async function summarizeTranscript(input: SummarizeTranscriptInput): Promise<SummarizeTranscriptOutput> {
  return summarizeTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTranscriptPrompt',
  input: {schema: SummarizeTranscriptInputSchema},
  output: {schema: SummarizeTranscriptOutputSchema},
  prompt: `You are an expert assistant skilled at summarizing meeting transcripts.
Based on the transcript provided, identify and extract the key information.

{{#if clientName}}
Meeting Topic/Client: {{{clientName}}}
{{/if}}
Transcript:
{{{transcript}}}

Your output must include:
1.  **Title**: A clear and concise title for the meeting summary.
2.  **Key Decisions**: A bulleted list of the most important decisions that were finalized.
3.  **Action Items**: A bulleted list of all tasks or follow-ups that were assigned. If possible, note who is responsible for each item.
4.  **Concerns**: A bulleted list of any potential issues, risks, or open questions that were raised.
`,
});

const summarizeTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeTranscriptFlow',
    inputSchema: SummarizeTranscriptInputSchema,
    outputSchema: SummarizeTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
