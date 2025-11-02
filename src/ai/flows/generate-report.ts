
'use server';
/**
 * @fileOverview A flow to generate reports based on user data.
 *
 * - generateReport - The main flow function.
 * - GenerateReportInput - The input type for the flow.
 * - GenerateReportOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  getHabitsForReport,
  getJournalEntriesForReport,
  getFinanceRecordsForReport,
} from '@/services/reports';

export const GenerateReportInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate the report for.'),
  reportType: z
    .enum(['habits', 'journal', 'finances'])
    .describe('The type of report to generate.'),
  timeframe: z
    .enum(['weekly', 'monthly'])
    .describe('The timeframe for the report.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated report content in Markdown format.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;


const reportTool = ai.defineTool(
  {
    name: 'fetchReportData',
    description: 'Fetches the underlying data for a user report from the database.',
    inputSchema: z.object({
      userId: z.string(),
      reportType: z.enum(['habits', 'journal', 'finances']),
      timeframe: z.enum(['weekly', 'monthly']),
    }),
    outputSchema: z.string().describe("The data for the report in JSON format."),
  },
  async ({ userId, reportType, timeframe }) => {
    let data;
    const days = timeframe === 'weekly' ? 7 : 30;
    if (reportType === 'habits') {
      data = await getHabitsForReport(userId, days);
    } else if (reportType === 'journal') {
      data = await getJournalEntriesForReport(userId, days);
    } else if (reportType === 'finances') {
      data = await getFinanceRecordsForReport(userId, days);
    }
    return JSON.stringify(data);
  }
);


export const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
    tools: [reportTool]
  },
  async (input) => {
    const { reportType, timeframe, userId } = input;

    const prompt = `You are an insightful and encouraging assistant. Your task is to generate a ${timeframe} ${reportType} report for a user.
    Use the 'fetchReportData' tool to get the user's data.
    
    Analyze the data and provide a summary that is:
    1.  **Concise:** Keep it brief and to the point.
    2.  **Insightful:** Highlight key trends, patterns, or important takeaways.
    3.  **Encouraging:** Frame the analysis in a positive and motivational way, even if the data shows challenges.
    
    Format the output as Markdown. Start with a clear title. Use headings, lists, and bold text to make it readable.
    
    Generate the ${timeframe} ${reportType} report for user ${userId}.`;

    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      tools: [reportTool],
      output: {
          schema: z.object({
              report: z.string().describe('The generated report content in Markdown format.')
          })
      }
    });

    return output!;
  }
);

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
    return generateReportFlow(input);
}
