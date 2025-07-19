'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

// ✅ FIXED: dynamically import named components correctly
const Leaderboard = dynamic(() => import('@/components/leaderboard').then(mod => mod.Leaderboard), { ssr: false });
const AnimatedText = dynamic(() => import('@/components/animated-text').then(mod => mod.AnimatedText), { ssr: false });
const InteractiveWrapper = dynamic(() => import('@/components/interactive-wrapper').then(mod => mod.InteractiveWrapper), { ssr: false });

export default function HomeClient({ searchParams }: { searchParams?: { ref: string | null } }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <InteractiveWrapper showWallpaper={true}>
      <Leaderboard isOpen={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen} />

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header />

        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:bg-white/10 hover:text-white transition-transform hover:scale-110"
          onClick={() => setIsLeaderboardOpen(true)}
        >
          <Trophy />
          <span className="sr-only">Open Leaderboard</span>
        </Button>

        <main className="flex flex-1 items-start justify-start p-4 md:p-8 pt-16 md:pt-24">
          <div 
            className={`w-full bg-black/50 backdrop-blur-md rounded-lg p-6 border border-white/10 opacity-0 animate-fade-in transition-all duration-500 ${
              isSubmitted ? 'max-w-2xl ml-0 md:ml-8' : 'max-w-md ml-0 md:ml-16'
            }`}
            style={{ animationDelay: '1s' }}
          >
            {!isSubmitted && (
              <>
                <h1 className="text-2xl font-headline font-bold text-primary min-h-[32px]">
                  <AnimatedText text="Get Early Access" delay={1200} />
                </h1>
                <p className="mt-2 text-foreground/80 min-h-[80px]">
                  <AnimatedText 
                    text="The next era of utility is coming to Hyperliquid. Sign up for updates — and your chance at early access to the HyperFueled platform."
                    delay={1300}
                  />
                </p>
              </>
            )}

            <SignupForm 
              isSubmitted={isSubmitted} 
              setIsSubmitted={setIsSubmitted}
              searchParams={searchParams}
            />
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
