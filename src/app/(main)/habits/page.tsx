"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Plus, Repeat, Flame } from "lucide-react";
import type { Habit } from "@/lib/types";

const initialHabits: Habit[] = [
  { id: "1", name: "Read 10 pages", completed: false, streak: 12 },
  { id: "2", name: "Morning meditation", completed: true, streak: 4 },
  { id: "3", name: "30-minute walk", completed: false, streak: 0 },
  { id: "4", name: "Drink 8 glasses of water", completed: true, streak: 28 },
  { id: "5", name: "Plan tomorrow", completed: false, streak: 9 },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabitName, setNewHabitName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleAddHabit = () => {
    if (newHabitName.trim() === "") return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      completed: false,
      streak: 0,
    };
    setHabits([...habits, newHabit]);
    setNewHabitName("");
    setIsDialogOpen(false);
  };

  return (
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
        {habits.map((habit) => (
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
                onClick={() => toggleHabit(habit.id)}
              >
                <Checkbox checked={habit.completed} className="mr-2" />
                {habit.completed ? "Completed" : "Mark as Complete"}
              </Button>
            </CardFooter>
          </Card>
        ))}
         <Card className="flex items-center justify-center border-2 border-dashed">
            <DialogTrigger asChild>
                <button className="text-center p-6 w-full h-full">
                    <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-headline text-lg">Add New Habit</h3>
                    <p className="text-sm text-muted-foreground">Start a new routine.</p>
                </button>
            </DialogTrigger>
        </Card>
      </div>
    </div>
  );
}
