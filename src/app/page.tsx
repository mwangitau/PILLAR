import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PillarLogo } from '@/components/icons/logo';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PillarLogo className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl font-bold">Pillar</span>
        </Link>
        <Button asChild variant="ghost">
          <Link href="/login">
            Log In
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build a Stronger You, One Day at a Time
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Pillar is your personal AI companion for growth. Get personalized plans, build healthy habits, and find clarity on your journey to a better life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={600}
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Pillar. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
