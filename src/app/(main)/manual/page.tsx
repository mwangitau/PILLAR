
"use client";

import { useState, useEffect } from "react";
import { generatePersonalizedPlan, type PersonalizedPlanOutput } from "@/ai/flows/generate-personalized-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Lightbulb, Repeat, ShieldCheck, Smile, User, Zap, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking, useCollection } from "@/firebase";
import { doc, collection, query, limit, orderBy } from "firebase/firestore";
import type { UserProfile, OnboardingData, Plan } from "@/lib/types";

export default function ManualPage() {
  const [plan, setPlan] = useState<PersonalizedPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'userProfiles', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const onboardingDataRef = useMemoFirebase(() => userProfile?.onboardingDataId ? doc(firestore, 'onboardingData', userProfile.onboardingDataId) : null, [userProfile, firestore]);
  const { data: onboardingData, isLoading: isOnboardingDataLoading } = useDoc<OnboardingData>(onboardingDataRef);
  
  const planCollectionRef = useMemoFirebase(() => user ? query(collection(firestore, `users/${user.uid}/plans`), orderBy('createdAt', 'desc'), limit(1)) : null, [user, firestore]);
  const { data: plans, isLoading: arePlansLoading } = useCollection<Plan>(planCollectionRef);

  useEffect(() => {
    if (plans && plans.length > 0 && plans[0].content) {
      setPlan(JSON.parse(plans[0].content));
    }
  }, [plans]);

  const handleGeneratePlan = async () => {
    if (!userProfile || !onboardingData) {
      toast({
        title: "Information Missing",
        description: "We couldn't find your profile or onboarding data to generate a plan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setPlan(null);
    try {
      const input = {
        userProfile: JSON.stringify(userProfile),
        onboardingAnswers: onboardingData.answers,
        promptTemplates: "Focus on building a morning routine and practicing mindfulness.",
      };
      const result = await generatePersonalizedPlan(input);
      setPlan(result);
      
      if (user) {
        const planDoc = {
          userProfileId: user.uid,
          content: JSON.stringify(result),
          createdAt: new Date().toISOString(),
        };
        addDocumentNonBlocking(collection(firestore, `users/${user.uid}/plans`), planDoc);
      }

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
    { key: 'identityAdvice', title: 'Identity', icon: <User className="h-6 w-6" /> },
    { key: 'dailyRoutineAdvice', title: 'Daily Routine', icon: <Repeat className="h-6 w-6" /> },
    { key: 'habitAdvice', title: 'Habits', icon: <Zap className="h-6 w-6" /> },
    { key: 'sobrietyAdvice', title: 'Sobriety', icon: <ShieldCheck className="h-6 w-6" /> },
    { key: 'accountabilityAdvice', title: 'Accountability', icon: <Smile className="h-6 w-6" /> },
  ];

  const pageIsLoading = isUserLoading || isUserProfileLoading || isOnboardingDataLoading || arePlansLoading;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Your Personal Manual"
        description="AI-generated guidance tailored to your goals and profile."
      >
        <Button onClick={handleGeneratePlan} disabled={isLoading || pageIsLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : "Generate My Plan"}
        </Button>
      </PageHeader>
      
      {!plan && !isLoading && !pageIsLoading && (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline font-semibold">Ready for your personalized plan?</h2>
          <p className="text-muted-foreground mt-2 max-w-md">Click the "Generate My Plan" button to receive AI-powered advice on identity, habits, routines, and more, all tailored just for you.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading || pageIsLoading ? Array(5).fill(0) : adviceSections).map((section, index) => {
          const content = plan ? plan[section.key as keyof PersonalizedPlanOutput] : null;
          if (!content && !(isLoading || pageIsLoading)) return null;

          return (
            <Card key={isLoading || pageIsLoading ? index : section.key}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                {isLoading || pageIsLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : section.icon}
                <CardTitle className="font-headline text-2xl">{isLoading || pageIsLoading ? <Skeleton className="h-6 w-32" /> : section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading || pageIsLoading ? (
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
