"use client";

import { useState } from "react";
import { analyzeJournalEntry, type JournalAnalysisOutput } from "@/ai/flows/ai-driven-journaling-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { BookMarked, Bot, Loader2, Sparkles } from "lucide-react";
import type { JournalEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const initialEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-07-20",
    content: "Felt really productive today. Managed to tackle a big project at work and still had energy to go for a run. The evening was peaceful. Feeling optimistic about the week ahead.",
    analysis: { mood: "Optimistic, Accomplished", sentiment: "Positive" },
  },
  {
    id: "2",
    date: "2024-07-19",
    content: "A bit of a stressful day. A lot of meetings and tight deadlines. Felt drained by the end of it. Hoping for a better day tomorrow.",
    analysis: { mood: "Stressed, Tired", sentiment: "Negative" },
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [newEntryContent, setNewEntryContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveEntry = async () => {
    if (newEntryContent.trim() === "") return;
    setIsLoading(true);

    try {
      const analysis: JournalAnalysisOutput = await analyzeJournalEntry({ journalEntry: newEntryContent });
      
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        content: newEntryContent,
        analysis,
      };

      setEntries([newEntry, ...entries]);
      setNewEntryContent("");
      toast({
        title: "Journal Entry Saved",
        description: "Your entry and its AI analysis have been successfully saved.",
      });
    } catch (error) {
      console.error("Failed to analyze and save entry:", error);
      toast({
        title: "Error",
        description: "Could not save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="AI-Driven Journaling"
        description="Record your thoughts and gain new insights with sentiment analysis."
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">New Entry</CardTitle>
          <CardDescription>What's on your mind today?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            placeholder="Write about your day, your thoughts, or anything that comes to mind..."
            rows={8}
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveEntry} disabled={isLoading || newEntryContent.trim() === ""}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing & Saving...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Save & Analyze Entry
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h2 className="font-headline text-3xl mb-6 flex items-center gap-2">
            <BookMarked className="h-7 w-7"/> Past Entries
        </h2>
        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
              {entry.analysis && (
                <CardFooter className="bg-secondary/50 p-4 rounded-b-lg flex-col items-start gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Bot className="h-5 w-5 text-primary"/> AI Analysis
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Mood: {entry.analysis.mood}</Badge>
                        <Badge variant="secondary">Sentiment: {entry.analysis.sentiment}</Badge>
                    </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
