
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
  createdAt: string;
  content: string;
  analysis: JournalAnalysisOutput | null;
};

export type FinanceRecord = {
    id: string;
    userProfileId: string;
    date: string;
    description: string;
    type: 'income' | 'expense' | 'tithe';
    amount: number;
    category: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  onboardingDataId: string;
  notificationPreferences?: {
    habitReminders: boolean;
    weeklySummary: boolean;
    partnerUpdates: boolean;
  };
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
