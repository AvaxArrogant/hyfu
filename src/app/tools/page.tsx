
'use client';

import { Header } from "@/components/header";
import { InteractiveWrapper } from "@/components/interactive-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { AnimatedText } from '@/components/animated-text';
import { ArrowRight, Wrench, Beaker, Network, Search, GitMerge, Puzzle, Shield, Layers, Fingerprint, FileJson, List } from 'lucide-react';
import { Button } from "@/components/ui/button";

const toolCategories = [
  {
    category: 'Explorers',
    icon: Search,
    tools: [
      { title: 'Etherscan', description: 'Official Etherscan explorer for HyperEVM.', link: 'https://hyperevmscan.io/' },
      { title: 'Parsec', description: 'Alternative block explorer with detailed analytics.', link: 'https://purrsec.com/' },
      { title: 'Blockscout', description: 'Another full-featured block explorer for HyperEVM.', link: 'https://www.hyperscan.com/' },
    ]
  },
  {
    category: 'EVM RPCs',
    icon: Network,
    tools: [
      { title: 'Mainnet RPC', description: 'Official public RPC endpoint for HyperEVM mainnet.', link: 'https://rpc.hyperliquid.xyz/evm' },
      { title: 'Testnet RPC', description: 'Official public RPC endpoint for HyperEVM testnet.', link: 'https://rpc.hyperliquid-testnet.xyz/evm' },
      { title: 'HypurrScan RPC', description: 'Community-run RPC endpoint.', link: 'http://rpc.hypurrscan.io' },
      { title: 'Stakely RPC', description: 'Public JSON-RPC provided by Stakely.', link: 'https://hyperliquid-json-rpc.stakely.io' },
      { title: 'Quicknode', description: 'High-performance RPC nodes for Hyperliquid.', link: 'https://www.quicknode.com/chains/hyperliquid' },
      { title: 'Chainstack', description: 'Enterprise-grade RPC and API services.', link: 'https://chainstack.com/build-better-with-hyperliquid/' },
    ]
  },
  {
    category: 'Archive Node RPCs',
    icon: FileJson,
    tools: [
        { title: 'HypeRPC by Imperator', description: 'Archive RPC for historical data access.', link: 'https://hyperpc.app/' },
        { title: 'Proof Group', description: 'Archive node support provided by Proof Group.', link: 'https://www.purroofgroup.com/' },
        { title: 'Altitude', description: 'High-altitude view of historical chain data.', link: 'https://rpc.reachaltitude.xyz/' },
    ]
  },
  {
    category: 'Native Gas Providers',
    icon: Beaker,
    tools: [
      { title: 'Gas.zip', description: 'Bridge assets to get native HYPE for gas.', link: 'https://www.gas.zip/' },
      { title: 'DeBridge', description: 'Cross-chain bridging to acquire native gas.', link: 'https://app.debridge.finance/' },
      { title: 'Cortex', description: 'AI-powered interface to buy HYPE tokens.', link: 'https://cortexprotocol.com/agent?q=buy%20hype' },
    ]
  },
  {
    category: 'Cross-Chain Messaging',
    icon: GitMerge,
    tools: [
      { title: 'LayerZero', description: 'Interoperability protocol for omnichain applications.', link: 'https://docs.layerzero.network/v2/deployments/deployed-contracts?chains=hyperliquid' },
      { title: 'DeBridge', description: 'Secure cross-chain messaging and value transfer.', link: 'https://docs.debridge.finance/the-debridge-messaging-protocol/deployed-contracts#evm-chains' },
      { title: 'Hyperlane', description: 'The permissionless interoperability layer.', link: 'https://docs.hyperlane.xyz/docs/reference/default-ism-validators' },
    ]
  },
  {
    category: 'Indexing & Subgraphs',
    icon: Puzzle,
    tools: [
      { title: 'Goldsky', description: 'Real-time data indexing for dApps.', link: 'https://docs.goldsky.com/chains/hyperevm' },
      { title: 'Allium', description: 'Comprehensive blockchain data and analytics.', link: 'https://docs.allium.so/historical-chains/supported-blockchains/hyperliquid' },
      { title: 'SQD', description: 'Subsquid decentralized data lake support.', link: 'https://docs.sqd.ai/hyperliquid-support/' },
    ]
  },
  {
    category: 'Multi-Sig Solutions',
    icon: Shield,
    tools: [
      { title: 'Den SAFE', description: 'SAFE multi-sig instance by onchainden.', link: 'https://safe.onchainden.com/welcome' },
      { title: 'Palmera SAFE', description: 'SAFE multi-sig and DAO tooling.', link: 'https://x.com/palmera_dao/status/1899460307401019488' },
      { title: 'Fireblocks MPC', description: 'Enterprise-grade MPC wallet solutions.', link: 'https://www.fireblocks.com/integrations/protocols/' },
      { title: 'Tholos MPC', description: 'MPC-based multi-sig wallet platform.', link: 'https://www.tholos.app/' },
    ]
  },
  {
    category: 'Smart Contract Tooling',
    icon: Wrench,
    tools: [
        { title: 'Foundry', description: 'A blazing fast, portable, and modular toolkit for Ethereum application development.', link: 'https://book.getfoundry.sh/' },
        { title: 'Hardhat', description: 'A flexible and extensible Ethereum development environment for smart contracts.', link: 'https://hardhat.org/' },
        { title: 'Remix', description: 'Powerful, open source, in-browser IDE for Solidity development.', link: 'https://remix-project.org/' },
        { title: 'Gelato', description: 'Web3 automation and serverless backend services.', link: 'https://docs.gelato.network/web3-services' },
        { title: 'Proof of Play RNG', description: 'Verifiable Random Function (VRF) for on-chain randomness.', link: 'https://docs.proofofplay.com/services/vrng/about' },
    ]
  },
  {
    category: 'Account Abstraction',
    icon: Fingerprint,
    tools: [
      { title: 'ZeroDev', description: 'Build user-friendly dApps with Account Abstraction.', link: 'https://docs.zerodev.app/' },
    ]
  },
  {
    category: 'General Tools & SDKs',
    icon: Layers,
    tools: [
      { title: 'Big/Small Block Toggle', description: 'Tool to toggle between block processing modes.', link: 'https://hyperevm-block-toggle.vercel.app' },
      { title: 'Python SDK Example', description: 'Example of using the Python SDK with big blocks.', link: 'https://github.com/hyperliquid-dex/hyperliquid-python-sdk/blob/master/examples/basic_evm_use_big_blocks.py' },
      { title: 'Hyperliquid SDK', description: 'A comprehensive TypeScript SDK for programmatic interaction.', link: 'https://www.npmjs.com/package/@hyperliquid/sdk' },
    ]
  }
]

const formatId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

export default function ToolsPage() {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Header isConnected={isConnected} onConnect={handleConnect} />
        
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

    
