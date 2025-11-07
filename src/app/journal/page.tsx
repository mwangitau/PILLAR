
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
import { useFirestore, useUser, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/layout/sidebar";

export default function JournalPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const journalCollection = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, "users", user.uid, "journalEntries"), orderBy("date", "desc"));
  }, [firestore, user]);

  const { data: entries, isLoading: areEntriesLoading } = useCollection<Omit<JournalEntry, 'id'>>(journalCollection);

  const [newEntryContent, setNewEntryContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSaveEntry = async () => {
    if (newEntryContent.trim() === "" || !journalCollection) return;
    setIsAnalyzing(true);

    try {
      const analysis: JournalAnalysisOutput = await analyzeJournalEntry({ journalEntry: newEntryContent });
      
      const newEntry = {
        date: new Date().toISOString(),
        content: newEntryContent,
        analysis,
      };

      addDocumentNonBlocking(collection(firestore, "users", user!.uid, "journalEntries"), newEntry);

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
      setIsAnalyzing(false);
    }
  };

  const isLoading = isUserLoading || areEntriesLoading;

  return (
    <div className="flex h-screen">
    <AppSidebar />
    <main className="flex-1 overflow-y-auto">
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
            disabled={isAnalyzing}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveEntry} disabled={isAnalyzing || newEntryContent.trim() === ""}>
            {isAnalyzing ? (
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
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
             <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/50 p-4 rounded-b-lg">
                    <Skeleton className="h-8 w-40" />
                </CardFooter>
              </Card>
          ))}
          {!isLoading && entries?.map((entry) => (
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
    </main>
    </div>
  );
}
