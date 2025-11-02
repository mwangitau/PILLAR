'use server';
/**
 * @fileOverview AI-Driven Journaling Analysis Flow.
 *
 * This flow analyzes journal entries to detect mood and sentiment.
 *
 * @param {string} journalEntry - The journal entry to analyze.
 * @returns {Promise<JournalAnalysisOutput>} - An object containing the sentiment and mood analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalAnalysisInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to analyze for sentiment and mood.'),
});
export type JournalAnalysisInput = z.infer<typeof JournalAnalysisInputSchema>;

const JournalAnalysisOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The overall sentiment of the journal entry (e.g., positive, negative, neutral).' + ' Be specific, rather than general.'
    ),
  mood: z
    .string()
    .describe('The identified mood or emotions expressed in the journal entry.'),
});
export type JournalAnalysisOutput = z.infer<typeof JournalAnalysisOutputSchema>;

export async function analyzeJournalEntry(
  input: JournalAnalysisInput
): Promise<JournalAnalysisOutput> {
  return analyzeJournalEntryFlow(input);
}

const analyzeJournalEntryPrompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: JournalAnalysisInputSchema},
  output: {schema: JournalAnalysisOutputSchema},
  prompt: `Analyze the following journal entry for sentiment and mood.

Journal Entry:
{{{journalEntry}}}

Provide a concise analysis of the sentiment and identify the mood expressed in the entry.
Respond directly and be specific. Be specific, rather than general.`,
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: JournalAnalysisInputSchema,
    outputSchema: JournalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await analyzeJournalEntryPrompt(input);
    return output!;
  }
);
