
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { interactiveOnboardingChat } from "@/ai/flows/interactive-onboarding-chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { setDocumentNonBlocking, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export function OnboardingChat() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Welcome to Pillar! I'm here to help you get started by building a personalized plan. To begin, what's your first name?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState({});

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const response = await interactiveOnboardingChat({
        message: input,
        profile: profile,
      });

      const aiMessage: Message = { sender: "ai", text: response.response };
      setMessages((prev) => [...prev, aiMessage]);
      setProfile(response.profile);
      
      if (response.isComplete) {
        setIsComplete(true);
        await saveOnboardingData(response.profile);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        sender: "ai",
        text: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveOnboardingData = async (finalProfile: any) => {
    if (!user || !firestore) return;
    try {
      // 1. Save onboarding answers
      const onboardingData = { answers: JSON.stringify(finalProfile) };
      const onboardingCol = collection(firestore, 'onboardingData');
      const onboardingDocRef = doc(onboardingCol); // Create a reference with a new ID
      setDocumentNonBlocking(onboardingDocRef, onboardingData, {});


      // 2. Create user profile
      const userProfileRef = doc(firestore, "userProfiles", user.uid);
      const userProfileData = {
        id: user.uid,
        name: finalProfile.name || "Anonymous User",
        email: user.email || "",
        onboardingDataId: onboardingDocRef.id,
      };
      setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });

    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  const isLoading = isUserLoading || isProcessing;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4",
                message.sender === "user" ? "justify-end" : ""
              )}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md md:max-w-lg rounded-lg p-3 text-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="max-w-md md:max-w-lg rounded-lg p-3 text-sm bg-background flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 md:p-6 bg-background border-t">
        {isComplete ? (
          <div className="text-center">
            <p className="font-semibold mb-4">Onboarding complete! We have enough information to build your personal manual.</p>
            <Button onClick={() => router.push('/dashboard')} size="lg">
              Continue to Dashboard <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || input.trim() === ""}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
