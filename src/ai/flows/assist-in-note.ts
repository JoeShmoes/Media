
'use server';
/**
 * @fileOverview A Genkit flow for assisting with writing and editing notes.
 *
 * - assistInNote - A function that handles the note assistance.
 * - AssistInNoteInput - The input type for the assistInNote function.
 * - AssistInNoteOutput - The return type for the assistInNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generate} from 'genkit/generate';

const AssistInNoteInputSchema = z.object({
  noteContent: z.string().describe('The current content of the note.'),
  prompt: z.string().describe('The user\'s instruction or prompt for the AI.'),
});
export type AssistInNoteInput = z.infer<typeof AssistInNoteInputSchema>;

const AssistInNoteOutputSchema = z.object({
  newContent: z.string().describe("The generated or modified content for the note."),
});
export type AssistInNoteOutput = z.infer<typeof AssistInNoteOutputSchema>;


export async function assistInNote(input: AssistInNoteInput): Promise<AssistInNoteOutput> {
  return assistInNoteFlow(input);
}


export async function assistInNoteStream(input: AssistInNoteInput) {
  const { stream } = await generate({
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an expert writing assistant embedded in a note-taking application.
Your goal is to help the user with their note based on their prompt.

The user's current note content is:
---
${input.noteContent}
---

The user's request is:
"${input.prompt}"

Based on the request, modify or add to the note content. Only return the new, complete content for the note.
If the prompt asks a question about the content, answer it and then append the answer to the note.
If the existing content is empty, generate new content based on the prompt.
Do not wrap your response in markdown.
`,
    stream: true,
  });
  return stream;
}

const prompt = ai.definePrompt({
  name: 'assistInNotePrompt',
  input: {schema: AssistInNoteInputSchema},
  output: {schema: AssistInNoteOutputSchema},
  prompt: `You are an expert writing assistant embedded in a note-taking application.
Your goal is to help the user with their note based on their prompt.

The user's current note content is:
---
{{{noteContent}}}
---

The user's request is:
"{{{prompt}}}"

Based on the request, modify or add to the note content. Only return the new, complete content for the note.
If the prompt asks a question about the content, answer it and then append the answer to the note.
If the existing content is empty, generate new content based on the prompt.
`,
});

const assistInNoteFlow = ai.defineFlow(
  {
    name: 'assistInNoteFlow',
    inputSchema: AssistInNoteInputSchema,
    outputSchema: AssistInNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
