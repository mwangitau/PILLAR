
import type { JournalAnalysisOutput } from "@/ai/flows/ai-driven-journaling-analysis";

export type Habit = {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  createdAt: string;
};

export type JournalEntry = {
  id:string;
  userProfileId: string;
  date: string;
  content: string;
  analysis: JournalAnalysisOutput | null;
};

export type Transaction = {
    id: string;
    userProfileId: string;
    date: string;
    description: string;
    type: 'income' | 'expense' | 'tithe';
    amount: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  onboardingDataId: string;
};

export type OnboardingData = {
  id: string;
  answers: string;
};

export type Plan = {
  id: string;
  userProfileId: string;
  content: string;
  createdAt: string;
};

export type AccountabilityPartner = {
  id: string;
  userProfileId: string;
  partnerEmail: string;
  name?: string;
  permissions: string;
  consentLog: string;
};
