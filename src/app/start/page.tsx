
import { OnboardingChat } from "@/components/onboarding/chat";
import { PillarLogo } from "@/components/icons/logo";

export default function OnboardingPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-muted/20">
      <header className="p-4 flex items-center gap-3 border-b bg-background">
        <PillarLogo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-headline font-semibold">Welcome to Pillar</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <OnboardingChat />
      </div>
    </div>
  );
}
