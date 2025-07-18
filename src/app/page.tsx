
'use client';

import { useState } from "react";
import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { AnimatedText } from "@/components/animated-text";
import { SignupForm } from "@/components/signup-form";
import { Leaderboard } from "@/components/leaderboard";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <InteractiveWrapper showWallpaper={true}>
      <Leaderboard isOpen={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen} />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header isConnected={isConnected} onConnect={handleConnect} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => setIsLeaderboardOpen(true)}
        >
          <Trophy />
          <span className="sr-only">Open Leaderboard</span>
        </Button>

        <main className="flex flex-1 items-center justify-center md:justify-end p-4 md:p-16">
          <div 
            className="w-full max-w-sm bg-black/50 backdrop-blur-md rounded-lg p-6 border border-white/10 opacity-0 animate-fade-in"
            style={{ 
              animationDelay: '1s',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)'
            }}
          >
            {!isSubmitted && (
              <>
                <h1 className="text-2xl font-headline font-bold text-primary min-h-[32px]">
                  <AnimatedText text="Get Early Access" delay={1200} />
                </h1>
                <p className="mt-2 text-foreground/80 min-h-[80px]">
                  <AnimatedText text="The next era of utility is coming to Hyperliquid. Sign up for updates — and your chance at early access to the HyperFueled platform." delay={1300} />
                </p>
              </>
            )}
            <SignupForm 
              isSubmitted={isSubmitted} 
              setIsSubmitted={setIsSubmitted}
              isConnected={isConnected}
              onConnect={handleConnect}
            />
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
