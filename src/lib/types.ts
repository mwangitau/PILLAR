import type { JournalAnalysisOutput } from "@/ai/flows/ai-driven-journaling-analysis";

export type Habit = {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  analysis: JournalAnalysisOutput | null;
};

export type Transaction = {
    id: string;
    date: string;
    description: string;
    category: 'income' | 'expense' | 'tithe';
    amount: number;
};
