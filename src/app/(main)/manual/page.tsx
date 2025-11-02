"use client";

import { useState } from "react";
import { generatePersonalizedPlan, type PersonalizedPlanOutput } from "@/ai/flows/generate-personalized-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Lightbulb, Repeat, ShieldCheck, Smile, User, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ManualPage() {
  const [plan, setPlan] = useState<PersonalizedPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPlan(null);
    try {
      // Mocked inputs as per the feature description
      const input = {
        userProfile: "User is a 30-year-old software developer looking to improve work-life balance and reduce stress.",
        onboardingAnswers: "Struggles with procrastination, wants to exercise more, and feels disconnected from personal values.",
        promptTemplates: "Focus on building a morning routine and practicing mindfulness.",
      };
      const result = await generatePersonalizedPlan(input);
      setPlan(result);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate your personalized plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adviceSections = [
    {
      key: 'identityAdvice',
      title: 'Identity',
      icon: <User className="h-6 w-6" />,
    },
    {
      key: 'dailyRoutineAdvice',
      title: 'Daily Routine',
      icon: <Repeat className="h-6 w-6" />,
    },
    {
      key: 'habitAdvice',
      title: 'Habits',
      icon: <Zap className="h-6 w-6" />,
    },
    {
      key: 'sobrietyAdvice',
      title: 'Sobriety',
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      key: 'accountabilityAdvice',
      title: 'Accountability',
      icon: <Smile className="h-6 w-6" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Your Personal Manual"
        description="AI-generated guidance tailored to your goals and profile."
      >
        <Button onClick={handleGeneratePlan} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate My Plan"}
        </Button>
      </PageHeader>
      
      {!plan && !isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline font-semibold">Ready for your personalized plan?</h2>
          <p className="text-muted-foreground mt-2 max-w-md">Click the "Generate My Plan" button to receive AI-powered advice on identity, habits, routines, and more, all tailored just for you.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading ? Array(5).fill(0) : adviceSections).map((section, index) => {
          const content = plan ? plan[section.key as keyof PersonalizedPlanOutput] : null;
          if (!content && !isLoading) return null;

          return (
            <Card key={isLoading ? index : section.key}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                {isLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : section.icon}
                <CardTitle className="font-headline text-2xl">{isLoading ? <Skeleton className="h-6 w-32" /> : section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
