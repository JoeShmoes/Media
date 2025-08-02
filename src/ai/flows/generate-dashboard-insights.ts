
'use server';
/**
 * @fileOverview A Genkit flow for generating dynamic dashboard insights.
 *
 * This flow analyzes a user's business data (projects, deals, tasks)
 * and generates actionable suggestions and important notifications.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Project, Deal, Task } from '@/lib/types';

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


const GenerateDashboardInsightsInputSchema = z.object({
  projects: z.array(ProjectSchema).describe('The list of active projects.'),
  deals: z.array(DealSchema).describe('The list of deals in the sales pipeline.'),
  tasks: z.array(TaskSchema).describe('The list of tasks.'),
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

Analyze the following data:
- Projects: {{{json projects}}}
- Deals: {{{json deals}}}
- Tasks: {{{json tasks}}}

Based on this data, generate:
1.  **Suggestions**: 3 high-impact, actionable growth suggestions for the user to focus on this week. These should be strategic and forward-looking. For each suggestion, provide a relevant 'href' to the most appropriate room in the application. Examples:
    - Text: "Launch a new ad campaign for the '[Offer Title]' offer.", href: "/offer-builder"
    - Text: "Create a follow-up YouTube video about '[Relevant Topic]'.", href: "/youtube-studio"
    - Text: "Email uncontacted leads from the last 7 days.", href: "/outreach"
2.  **Notifications**: Up to 4 critical or warning-level notifications about the current state of their business. Focus on urgent issues, risks, and deadlines. Examples: "Project '[Project Title]' is nearing its deadline." or "You haven't contacted new lead '[Lead Name]' for 3 days."

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
    // If all lists are empty, return a default state.
    if (input.projects.length === 0 && input.deals.length === 0 && input.tasks.length === 0) {
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
