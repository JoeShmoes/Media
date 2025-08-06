
'use server';
/**
 * @fileOverview A Genkit flow for generating dynamic dashboard insights.
 *
 * This flow analyzes a user's business data (projects, deals, tasks)
 * and generates actionable suggestions and important notifications.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Project, Deal, Task, Offer, BrandVoice, Persona, Goal, Note, Client, Transaction } from '@/lib/types';

// Define schemas based on existing types without re-declaring all fields
const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  deadline: z.string().optional(),
});

const DealSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  value: z.number(),
  clientName: z.string().optional(),
});

const TaskSchema = z.object({
    id: z.string(),
    name: z.string(),
    completed: z.boolean(),
    dueDate: z.string().optional(),
});

const OfferSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
});

const BrandVoiceSchema = z.object({
    tone: z.string(),
    style: z.string(),
    examples: z.string(),
});

const PersonaSchema = z.object({
    name: z.string(),
    bio: z.string(),
});

const GoalSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
});

const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

const ClientSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
});

const TransactionSchema = z.object({
    id: z.string(),
    type: z.enum(["income", "expense"]),
    amount: z.number(),
    category: z.string(),
});


const GenerateDashboardInsightsInputSchema = z.object({
  projects: z.array(ProjectSchema).describe('The list of active projects.'),
  deals: z.array(DealSchema).describe('The list of deals in the sales pipeline.'),
  tasks: z.array(TaskSchema).describe('The list of tasks.'),
  offers: z.array(OfferSchema).describe('The list of created offers.'),
  brandVoice: BrandVoiceSchema.optional().describe('The defined brand voice.'),
  personas: z.array(PersonaSchema).describe('The list of defined customer personas.'),
  goals: z.array(GoalSchema).describe('The list of high-level business goals.'),
  notes: z.array(NoteSchema).describe('The list of recent notes.'),
  clients: z.array(ClientSchema).describe('The list of clients.'),
  transactions: z.array(TransactionSchema).describe('The list of recent financial transactions.'),
});
export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;

const GenerateDashboardInsightsOutputSchema = z.object({
  suggestions: z.array(z.object({
    text: z.string().describe("The actionable growth suggestion for the user."),
    href: z.string().describe("The relevant application path for the suggestion (e.g., '/offer-builder', '/youtube-studio')."),
  })).describe("A list of 3 actionable growth suggestions for the user this week."),
  notifications: z.array(z.object({
      text: z.string().describe("The notification message."),
      level: z.enum(['info', 'warning', 'critical']).describe("The severity level of the notification."),
  })).describe("A list of up to 4 important alerts or notifications."),
});
export type GenerateDashboardInsightsOutput = z.infer<typeof GenerateDashboardInsightsOutputSchema>;

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
  return generateDashboardInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDashboardInsightsPrompt',
  input: {schema: GenerateDashboardInsightsInputSchema},
  output: {schema: GenerateDashboardInsightsOutputSchema},
  prompt: `You are an expert business analyst AI. Your job is to analyze the user's current business data and provide actionable insights.

Analyze all available data to get a holistic view of the business:
- Projects: {{{json projects}}}
- Deals: {{{json deals}}}
- Tasks: {{{json tasks}}}
- Offers: {{{json offers}}}
- Brand Voice: {{{json brandVoice}}}
- Personas: {{{json personas}}}
- Goals: {{{json goals}}}
- Notes: {{{json notes}}}
- Clients: {{{json clients}}}
- Transactions: {{{json transactions}}}


Based on this complete data set, generate:
1.  **Suggestions**: 3 high-impact, actionable growth suggestions for the user to focus on this week. These should be strategic and forward-looking, and can cross-reference different parts of the business. For each suggestion, provide a relevant 'href' to the most appropriate room in the application. Examples:
    - Text: "Launch a new ad campaign for the '[Offer Title]' offer, targeting the '[Persona Name]' persona.", href: "/outreach"
    - Text: "Create a follow-up YouTube video about '[Relevant Topic from a Note]'.", href: "/youtube-studio"
    - Text: "Define a new business goal in the Cortex Room to stay focused on your top priorities.", href: "/cortex-room"
    - Text: "Create a new project for client '[Client Name]' based on the recently closed deal '[Deal Title]'.", href: "/projects"
2.  **Notifications**: Up to 4 critical or warning-level notifications about the current state of their business. Focus on urgent issues, risks, and deadlines across all rooms. Examples: "Project '[Project Title]' is nearing its deadline." or "You have a high-value deal '[Deal Title]' in negotiation that hasn't been updated in 5 days." or "Your expenses in '[Category]' are trending higher than your income this month."

Your tone should be concise, helpful, and direct.
`,
});

const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: GenerateDashboardInsightsInputSchema,
    outputSchema: GenerateDashboardInsightsOutputSchema,
  },
  async input => {
    // Check if all relevant data arrays are empty
    const isDataEmpty = input.projects.length === 0 &&
                        input.deals.length === 0 &&
                        input.tasks.length === 0 &&
                        input.offers.length === 0 &&
                        input.personas.length === 0 &&
                        input.goals.length === 0 &&
                        input.notes.length === 0 &&
                        input.clients.length === 0 &&
                        input.transactions.length === 0;

    if (isDataEmpty) {
        return {
            suggestions: [
                { text: "Define your first business goal in the Cortex Room.", href: "/cortex-room" },
                { text: "Create a new offer in the Offer Builder.", href: "/offer-builder" },
                { text: "Add your first client to start tracking your work.", href: "/clients" }
            ],
            notifications: [
                { text: "Welcome to your new command center! Add some data to get started.", level: "info" }
            ]
        };
    }
      
    const {output} = await prompt(input);
    return output!;
  }
);
