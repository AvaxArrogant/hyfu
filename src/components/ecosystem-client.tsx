
'use client';

import Image from 'next/image';
import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { AnimatedText } from '@/components/animated-text';
import { ArrowRight, ShieldCheck, Layers, Boxes, FileText } from 'lucide-react';

const featuredDapps = [
  { 
    name: 'HypeAlts Exchange', 
    description: 'A decentralized exchange offering a wide range of altcoin perpetuals, built on HyperEVM.', 
    logoUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=center', 
    dataAiHint: 'abstract logo' 
  },
  { 
    name: 'YieldVaults', 
    description: 'Automated yield farming and strategy vaults that leverage L1 state for optimized returns.', 
    logoUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center', 
    dataAiHint: 'abstract logo' 
  },
  { 
    name: 'LiquidLend', 
    description: 'An over-collateralized lending protocol for HYPE and other native assets on Hyperliquid.', 
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop&crop=center', 
    dataAiHint: 'abstract logo' 
  },
]

const partners = [
  { name: 'LayerZero', description: 'Interoperability protocol.', logoUrl: '/images/pyth.webp', dataAiHint: 'abstract logo' },
  { name: 'Pyth', description: 'Decentralized oracle network.', logoUrl: '/images/pyth.webp', dataAiHint: 'abstract logo' },
  { name: 'Den SAFE', description: 'Multi-sig solutions.', logoUrl: '/images/pyth.webp', dataAiHint: 'abstract logo' },
  { name: 'Quicknode', description: 'High-performance RPC nodes.', logoUrl: '/images/Quicknode.webp', dataAiHint: 'abstract logo' },
  { name: 'Goldsky', description: 'Real-time data indexing.', logoUrl: '/images/goldsky.webp', dataAiHint: 'abstract logo' },
  { name: 'Chainstack', description: 'Enterprise-grade RPC services.', logoUrl: '/images/chainstack.webp', dataAiHint: 'abstract logo' },
]

const audits = [
    {
        name: 'Zellic Audit Report - Dec 2023',
        description: 'Comprehensive security audit of the Hyperliquid bridge contract and platform updates.',
        link: 'https://2356094849-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FyUdp569E6w18GdfqlGvJ%2Fuploads%2FRhEpax5uWlJelxdFNb9c%2F2312%20Hyperliquid%20-%20Zellic%20Audit%20Report.pdf?alt=media&token=1e76a9b0-3a04-4d44-a8c9-a468e60cf7f1'
    },
    {
        name: 'Zellic Audit Report - Aug 2023',
        description: 'Initial comprehensive security audit of the core Hyperliquid perpetuals exchange.',
        link: 'https://2356094849-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FyUdp569E6w18GdfqlGvJ%2Fuploads%2FuiAL7ufANHbcsrAvZgLQ%2F2308%20Hyperliquid%20-%20Zellic%20Audit%20Report.pdf?alt=media&token=7450a0f9-c2c8-4c3e-907a-5619b431e86c'
    }
]

export default function EcosystemPage() {

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header />
        
        <main className="flex-1 px-8 md:px-16 pb-16">
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-2">
              <AnimatedText text="A Growing Ecosystem" delay={300} />
            </h1>
            <p className="text-base text-foreground/80 max-w-3xl mb-12">
              <AnimatedText text="HyperFueled is part of a vast network of dApps, infrastructure, and partners building the future of DeFi on Hyperliquid." delay={400} />
            </p>

            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <Boxes className="w-6 h-6 text-accent" />
                    <h2 className="text-lg md:text-xl font-headline text-primary">Featured dApps</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDapps.map((dapp, index) => (
                    <Card 
                    key={dapp.name}
                    className="bg-black/50 backdrop-blur-md border border-white/10 group hover:border-accent/50 transition-all duration-300 flex flex-col hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                    style={{ 
                        animation: `fade-in 0.5s ease-out ${0.5 + index * 0.1}s forwards`,
                        opacity: 0,
                    }}
                    >
                    <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                        <Image 
                            src={dapp.logoUrl} 
                            alt={`${dapp.name} logo`}
                            width={40}
                            height={40}
                            className="rounded-md bg-white/10 p-1"
                            data-ai-hint={dapp.dataAiHint}
                        />
                        <CardTitle className="text-lg font-headline text-primary">{dapp.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                        <p className="text-foreground/80 text-sm mb-4">{dapp.description}</p>
                        <a href="#" className="text-accent font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto text-sm">
                            Launch App <ArrowRight className="w-4 h-4" />
                        </a>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </section>

            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <Layers className="w-6 h-6 text-accent" />
                    <h2 className="text-lg md:text-xl font-headline text-primary">Infrastructure & Partners</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {partners.map((partner, index) => (
                    <div 
                        key={partner.name}
                        className="bg-black/50 backdrop-blur-md border border-white/10 group hover:border-accent/50 transition-colors duration-300 text-center p-4 flex flex-col items-center justify-center rounded-lg h-32"
                        style={{ 
                            animation: `fade-in 0.5s ease-out ${0.8 + index * 0.05}s forwards`,
                            opacity: 0,
                        }}
                    >
                        <Image 
                            src={partner.logoUrl} 
                            alt={`${partner.name} logo`}
                            width={40}
                            height={40}
                            className="rounded-md bg-white/10 p-1 mb-3"
                            data-ai-hint={partner.dataAiHint}
                        />
                        <p className="text-sm font-semibold text-primary">{partner.name}</p>
                    </div>
                ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                    <h2 className="text-lg md:text-xl font-headline text-primary">Audits & Security</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audits.map((audit, index) => (
                        <a 
                            key={audit.name} 
                            href={audit.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block group"
                            style={{ 
                                animation: `fade-in 0.5s ease-out ${1.2 + index * 0.1}s forwards`,
                                opacity: 0,
                            }}
                        >
                            <Card className="bg-black/50 backdrop-blur-md border border-white/10 group-hover:border-accent/50 transition-colors duration-300 h-full">
                                <CardContent className="p-4 flex items-start gap-4">
                                    <FileText className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-headline text-base text-primary mb-1">{audit.name}</h3>
                                        <p className="text-foreground/80 text-sm">{audit.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-accent ml-auto transition-colors" />
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
            </section>
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
