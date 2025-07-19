'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// ... existing imports here
import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedText } from '@/components/animated-text';
import { ArrowRight, Wrench, Beaker, Network, Search, GitMerge, Puzzle, Shield, Layers, Fingerprint, FileJson, List } from 'lucide-react';
import { Button } from "@/components/ui/button";

const toolCategories = [/* ... unchanged ... */];

const formatId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

export default function ToolsClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref) {
      localStorage.setItem('ref', ref);
      // Optional: add Supabase log here
    }
  }, [ref]);

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header />

        <main className="flex-1 px-4 md:px-16 pb-16">
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary mb-2">
              <AnimatedText text="Developer Tools" delay={300} />
            </h1>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mb-8">
              <AnimatedText text="A curated list of essential tools and resources for builders on HyperEVM." delay={400} />
            </p>

            <div className="p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 mb-12">
              <div className="flex items-center gap-2 text-sm font-headline text-primary mb-3">
                <List className="w-4 h-4"/>
                <p>DIRECTORY</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {toolCategories.map((category) => (
                  <a 
                    key={category.category} 
                    href={`#${formatId(category.category)}`}
                    className="px-3 py-1 text-sm rounded-full bg-black/50 border border-transparent text-foreground/80 hover:bg-accent/10 hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    {category.category}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {toolCategories.map((category) => (
                <section key={category.category} id={formatId(category.category)} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <category.icon className="w-6 h-6 text-accent" />
                    <h2 className="text-2xl md:text-3xl font-headline text-primary">{category.category}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.tools.map((tool, index) => (
                      <Card 
                        key={tool.title}
                        className="bg-black/50 backdrop-blur-md border border-white/10 group hover:border-accent/50 transition-colors duration-300 flex flex-col"
                        style={{ 
                          animation: `fade-in 0.5s ease-out ${0.5 + index * 0.05}s forwards`,
                          opacity: 0,
                          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-headline text-primary">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <p className="text-foreground/80 mb-4 text-sm">{tool.description}</p>
                          <Button asChild variant="outline" className="mt-auto w-full bg-transparent border-accent/30 text-accent/80 hover:bg-accent/10 hover:text-accent hover:border-accent">
                            <a href={tool.link} target="_blank" rel="noopener noreferrer">
                              Learn More <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
