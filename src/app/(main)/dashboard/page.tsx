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

export default function Dashboard() {
  const dashboardImage = placeholderImages.find(p => p.id === 'dashboard-hero');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Welcome Back!"
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
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last week
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
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Habit Streak
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21 Days</div>
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
            <div className="text-2xl font-bold">+Ksh 15,231.89</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
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
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Repeat className="h-8 w-8 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Completed "Morning Meditation"
                </p>
                <p className="text-sm text-muted-foreground">
                  Habit logged
                </p>
              </div>
              <div className="ml-auto font-medium">Streak: 5</div>
            </div>
            <div className="flex items-center gap-4">
              <BookText className="h-8 w-8 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  New Journal Entry
                </p>
                <p className="text-sm text-muted-foreground">
                  Mood: <span className="font-semibold">Optimistic</span>
                </p>
              </div>
              <div className="ml-auto font-medium">Today</div>
            </div>
            <div className="flex items-center gap-4">
              <Landmark className="h-8 w-8 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Expense Added
                </p>
                <p className="text-sm text-muted-foreground">
                  Category: Groceries
                </p>
              </div>
              <div className="ml-auto font-medium">-Ksh 3,500</div>
            </div>
            <div className="flex items-center gap-4">
              <Repeat className="h-8 w-8 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Completed "Read 10 pages"
                </p>
                <p className="text-sm text-muted-foreground">
                  Habit logged
                </p>
              </div>
              <div className="ml-auto font-medium">Streak: 12</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
