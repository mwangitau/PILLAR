"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Plus, Flame, Loader2 } from "lucide-react";
import type { Habit } from "@/lib/types";
import { useFirestore, useUser, useCollection, addDocumentNonBlocking, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/layout/AppLayout";

export default function HabitsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const habitsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, "users", user.uid, "habits");
  }, [firestore, user]);

  const { data: habits, isLoading: areHabitsLoading } = useCollection<Omit<Habit, 'id'>>(habitsCollection);

  const [newHabitName, setNewHabitName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleHabit = (id: string, completed: boolean) => {
    if (!habitsCollection) return;
    const habitDocRef = doc(habitsCollection, id);
    updateDocumentNonBlocking(habitDocRef, { completed: !completed });
  };

  const handleAddHabit = () => {
    if (newHabitName.trim() === "" || !habitsCollection || !user) return;
    const newHabit = {
      name: newHabitName.trim(),
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
      userProfileId: user.uid,
    };
    addDocumentNonBlocking(habitsCollection, newHabit);
    setNewHabitName("");
    setIsDialogOpen(false);
  };
  
  const isLoading = isUserLoading || areHabitsLoading;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <PageHeader
          title="Habit & Routine Management"
          description="Create, track, and build lasting habits."
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Add a New Habit</DialogTitle>
                <DialogDescription>
                  What new habit would you like to build?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="habit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="habit-name"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Morning meditation"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddHabit}>Save Habit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-5 w-24" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
          {!isLoading && habits?.map((habit) => (
            <Card key={habit.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{habit.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center space-x-2">
                  <Flame className={`h-5 w-5 ${habit.streak > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm text-muted-foreground">
                    {habit.streak} day streak
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={habit.completed ? "secondary" : "default"} 
                  className="w-full"
                  onClick={() => toggleHabit(habit.id, habit.completed)}
                >
                  <Checkbox checked={habit.completed} className="mr-2" />
                  {habit.completed ? "Completed" : "Mark as Complete"}
                </Button>
              </CardFooter>
            </Card>
          ))}
           {!isLoading && (
              <Card className="flex items-center justify-center border-2 border-dashed">
                  <DialogTrigger asChild>
                      <button className="text-center p-6 w-full h-full" onClick={() => setIsDialogOpen(true)}>
                          <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="font-headline text-lg">Add New Habit</h3>
                          <p className="text-sm text-muted-foreground">Start a new routine.</p>
                      </button>
                  </DialogTrigger>
              </Card>
           )}
        </div>
      </div>
    </AppLayout>
  );
}
