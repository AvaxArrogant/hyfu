
'use client';

import Image from 'next/image';
import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, type MouseEvent } from 'react';
import { AnimatedText } from '@/components/animated-text';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function MintPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [supplyMinted] = useState(1337);
  const totalSupply = 8888;
  const { toast } = useToast();
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleMint = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint.",
        variant: "destructive",
      });
      return;
    }
    setIsMinting(true);
    toast({
      title: "Initializing Mint...",
      description: "Please confirm the transaction in your wallet.",
    });
    setTimeout(() => {
      setIsMinting(false);
      toast({
        title: "Mint Successful!",
        description: "Your HyperFueled Genesis NFT has been minted.",
      });
    }, 3000);
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    const rotateX = (y / height) * -20;
    const rotateY = (x / width) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.5s ease';
  };

  const mintProgress = (supplyMinted / totalSupply) * 100;

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header isConnected={isConnected} onConnect={handleConnect} />
        
        <main className="flex-1 flex items-center justify-center px-4 md:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
            <div
              className="w-full max-w-md mx-auto aspect-square relative opacity-0 animate-fade-in"
              style={{ animationDelay: '0.5s', transformStyle: 'preserve-3d' }}
            >
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="absolute inset-0 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}
              >
                <Image 
                  src="/images/nft.webp"
                  alt="HyperFueled Genesis NFT"
                  data-ai-hint="futuristic spaceship"
                  fill
                  className="object-cover rounded-lg p-2"
                />
              </div>
            </div>

            <div 
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: '0.7s' }}
            >
              <Card 
                className="bg-black/50 backdrop-blur-md border border-white/10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}
              >
                <CardHeader>
                  <CardTitle className="text-3xl font-headline text-primary">
                    <AnimatedText text="Genesis Mint" delay={800} />
                  </CardTitle>
                  <p className="text-foreground/80 pt-2">
                    Mint your HyperFueled Genesis NFT. Holders gain <AnimatedText text="[CLASSIFIED INFORMATION - LVL 3 CLEARANCE REQUIRED]" delay={900} neverDecrypt={true} />
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between font-code text-sm text-foreground/80">
                      <span>Supply Minted</span>
                      <span>{supplyMinted} / {totalSupply}</span>
                    </div>
                    <Progress value={mintProgress} className="h-2 bg-white/10 [&>div]:bg-accent" />
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <span className="font-headline text-lg text-primary">Price</span>
                    <span className="font-code text-2xl text-accent">1 HYPE</span>
                  </div>
                  
                  <Button 
                    onClick={handleMint} 
                    disabled={isMinting}
                    className="w-full h-14 text-lg bg-accent hover:bg-accent/90 disabled:opacity-50"
                  >
                    {isMinting ? 'Minting...' : 'Mint Now'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
