
'use client';

import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { AnimatedText } from '@/components/animated-text';
import { GitBranch, Network, ShieldCheck, Puzzle, Cpu, Code } from 'lucide-react';

const techFeatures = [
  { 
    title: 'HyperEVM Architecture', 
    description: 'A custom EVM rollup that settles on the Hyperliquid L1. It acts as a "based rollup," where L1 validators sequence transactions, eliminating the need for a centralized sequencer and enhancing security.',
    icon: GitBranch,
  },
  { 
    title: 'L1-Integrated State', 
    description: 'HyperEVM allows smart contracts to interact directly and synchronously with the L1 state, including the order book and user portfolios, enabling novel on-chain trading strategies and financial primitives.',
    icon: Network,
  },
  { 
    title: 'Censorship Resistance', 
    description: 'By relying on the Hyperliquid L1 validator set for transaction sequencing, HyperEVM inherits the L1\'s censorship resistance. Validators cannot ignore or reorder transactions without network consensus.',
    icon: ShieldCheck,
  },
  { 
    title: 'Specialized Precompiles', 
    description: 'Custom precompiles provide efficient, low-gas access to core L1 functions like placing orders, canceling orders, and querying user state, making complex DeFi applications feasible and affordable.',
    icon: Puzzle,
  },
  { 
    title: 'Optimistic, Slashing-Based Security', 
    description: 'While optimistic, HyperEVM forgoes traditional fraud proofs. Instead, it relies on the L1\'s proof-of-stake consensus; any validator proposing an invalid state transition is severely slashed, ensuring robust security.',
    icon: Cpu,
  },
  { 
    title: 'Developer Focused', 
    description: 'Full EVM compatibility means developers can use standard tools like Foundry, Hardhat, and Remix. The platform provides a testnet, block explorer, and faucets to streamline development and deployment.',
    icon: Code,
  },
]

export default function TechnologyPage() {

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header />
        
        <main className="flex-1 px-4 md:px-16 pb-16">
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary mb-2">
              <AnimatedText text="Core Technology: HyperEVM" delay={300} />
            </h1>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mb-12">
              <AnimatedText text="HyperFueled leverages HyperEVM, a high-performance, L1-integrated rollup that delivers unparalleled security, speed, and composability." delay={400} />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techFeatures.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="bg-black/50 backdrop-blur-md border border-white/10 group hover:border-accent/50 transition-colors duration-300"
                  style={{ 
                    animation: `fade-in 0.5s ease-out ${0.5 + index * 0.1}s forwards`,
                    opacity: 0,
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <feature.icon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                      <CardTitle className="text-xl font-headline text-primary">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
