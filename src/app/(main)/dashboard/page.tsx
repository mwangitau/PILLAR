
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  BookText,
  Landmark,
  Repeat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { placeholderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import type { Habit, JournalEntry, Transaction, UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'userProfiles', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    // If user is loaded and they don't have a profile (which means onboarding isn't complete)
    // redirect them to the start page.
    if (!isUserLoading && !isUserProfileLoading && user && !userProfile) {
      router.push('/start');
    }
  }, [user, userProfile, isUserLoading, isUserProfileLoading, router]);


  const habitsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/habits`), orderBy("createdAt", "desc")) : null
  , [user, firestore]);
  const journalQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/journalEntries`), orderBy("date", "desc"), limit(5)) : null
  , [user, firestore]);
  const financesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/financeRecords`), orderBy("date", "desc"), limit(5)) : null
  , [user, firestore]);

  const { data: habits, isLoading: habitsLoading } = useCollection<Habit>(habitsQuery);
  const { data: journalEntries, isLoading: journalLoading } = useCollection<JournalEntry>(journalQuery);
  const { data: transactions, isLoading: financesLoading } = useCollection<Transaction>(financesQuery);

  const dashboardImage = placeholderImages.find(p => p.id === 'dashboard-hero');
  const isLoading = isUserLoading || habitsLoading || journalLoading || financesLoading || isUserProfileLoading;

  const { habitProgress, habitStreak } = useMemo(() => {
    if (!habits) return { habitProgress: 0, habitStreak: 0 };
    const completedHabits = habits.filter(h => h.completed).length;
    const habitProgress = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;
    const habitStreak = habits.reduce((max, h) => (h.streak || 0) > max ? h.streak : max, 0);
    return { habitProgress, habitStreak };
  }, [habits]);

  const netFinances = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);
  
  const recentActivities = useMemo(() => {
    const activities = [
      ...(habits || []).map(h => ({ type: 'habit', data: h, date: new Date(h.createdAt) })),
      ...(journalEntries || []).map(j => ({ type: 'journal', data: j, date: new Date(j.date) })),
      ...(transactions || []).map(t => ({ type: 'finance', data: t, date: new Date(t.date) }))
    ];
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);
  }, [habits, journalEntries, transactions]);

  // Don't render anything if we're still checking auth or about to redirect.
  if (isUserLoading || isUserProfileLoading || (user && !userProfile)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Skeleton className="h-16 w-16 rounded-full animate-pulse" />
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title={`Welcome Back, ${userProfile?.name || 'User'}!`}
        description="Here's a snapshot of your journey with Pillar."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Habit Progress
            </CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{habitProgress.toFixed(0)}%</div>}
            <p className="text-xs text-muted-foreground">
              {habits?.filter(h => h.completed).length || 0} of {habits?.length || 0} habits completed today.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Journal Entries
            </CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{journalEntries?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">
              in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Longest Habit Streak
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{habitStreak} Days</div>}
            <p className="text-xs text-muted-foreground">
              Keep up the great work!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Finances
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className={`text-2xl font-bold ${netFinances >= 0 ? 'text-green-600' : 'text-red-600'}`}>Ksh {netFinances.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">
              Recent transaction balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Continue Your Journey</CardTitle>
            <CardDescription>
              Pick up where you left off or explore a new area of growth.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/manual">
                <Card className="h-full hover:bg-secondary transition-colors">
                  <CardHeader>
                    <CardTitle>Your Manual</CardTitle>
                    <CardDescription>Review your personalized AI-generated plan.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/habits">
                <Card className="h-full hover:bg-secondary transition-colors">
                  <CardHeader>
                    <CardTitle>Track Habits</CardTitle>
                    <CardDescription>Log today's progress and maintain your streaks.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
            {dashboardImage && 
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={dashboardImage.imageUrl}
                  alt={dashboardImage.description}
                  width={800}
                  height={300}
                  className="object-cover w-full h-full"
                  data-ai-hint={dashboardImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-headline font-bold text-white">New: AI Journal Analysis</h3>
                  <p className="text-white/90 max-w-prose mt-2">Discover deeper insights from your journal entries with our new mood and sentiment analysis feature.</p>
                  <Button asChild className="mt-4">
                    <Link href="/journal">Write a Journal Entry</Link>
                  </Button>
                </div>
              </div>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                An overview of your latest interactions.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="grid gap-1 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                </div>
            ))}
            {!isLoading && recentActivities.map((activity, i) => {
              if (activity.type === 'habit') {
                const habit = activity.data as Habit;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <Repeat className="h-8 w-8 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {habit.completed ? "Completed" : "Logged"}: "{habit.name}"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Habit {habit.completed ? "completed" : "logged"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Streak: {habit.streak || 0}</div>
                  </div>
                );
              }
              if (activity.type === 'journal') {
                const journal = activity.data as JournalEntry;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <BookText className="h-8 w-8 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        New Journal Entry
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mood: <span className="font-semibold">{journal.analysis?.mood}</span>
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs">
                        {format(new Date(journal.date), 'P')}
                    </div>
                  </div>
                );
              }
              if (activity.type === 'finance') {
                const transaction = activity.data as Transaction;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <Landmark className="h-8 w-8 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Added
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                    </div>
                    <div className={`ml-auto font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>Ksh {transaction.amount.toLocaleString()}</div>
                  </div>
                );
              }
              return null;
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
