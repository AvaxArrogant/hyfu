'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { InteractiveWrapper } from '@/components/interactive-wrapper';
import { AnimatedText } from '@/components/animated-text';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { MINT_CONTRACT_ADDRESS, MINT_CONTRACT_ABI } from '@/contracts/mintContract';
import { formatEther } from 'viem';

export default function MintPage() {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useAccount();

  const { data: totalMintedData, isLoading: isLoadingTotalMinted } = useReadContract({
    address: MINT_CONTRACT_ADDRESS,
    abi: MINT_CONTRACT_ABI,
    functionName: 'totalMinted',
  });

  const { data: maxSupplyData, isLoading: isLoadingMaxSupply } = useReadContract({
    address: MINT_CONTRACT_ADDRESS,
    abi: MINT_CONTRACT_ABI,
    functionName: 'MAX_SUPPLY',
  });

  const { data: pricePerNftData, isLoading: isLoadingPricePerNft } = useReadContract({
    address: MINT_CONTRACT_ADDRESS,
    abi: MINT_CONTRACT_ABI,
    functionName: 'PRICE_PER_NFT',
  });

  const supplyMinted = totalMintedData ? Number(totalMintedData) : 0;
  const totalSupply = maxSupplyData ? Number(maxSupplyData) : 0;
  const pricePerNft = pricePerNftData ?? 0n;

  const {
    writeContract,
    data: hash,
    isPending: isMintingPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isMintSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  const isMinting = isMintingPending || isConfirming;

  const handleMint = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint.',
        variant: 'destructive',
      });
      return;
    }

    if (!pricePerNft) {
      toast({
        title: 'Error',
        description: 'Could not retrieve NFT price. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    writeContract({
      address: MINT_CONTRACT_ADDRESS,
      abi: MINT_CONTRACT_ABI,
      functionName: 'mint',
      value: pricePerNft,
    });
  };

  useEffect(() => {
    if (isMintingPending) {
      toast({
        title: 'Initializing Mint...',
        description: 'Please confirm the transaction in your wallet.',
      });
    } else if (isMintSuccess) {
      toast({
        title: 'Mint Successful!',
        description: `Transaction confirmed: ${hash?.slice(0, 6)}...${hash?.slice(-4)}`,
      });
    } else if (writeError || confirmError) {
      toast({
        title: 'Mint Failed',
        description: writeError?.message || confirmError?.message || 'Unknown error.',
        variant: 'destructive',
      });
    }
  }, [isMintingPending, isMintSuccess, writeError, confirmError, hash, toast]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const mintProgress = totalSupply > 0 ? (supplyMinted / totalSupply) * 100 : 0;

  return (
    <InteractiveWrapper>
      <div className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 md:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
            {/* NFT Image Card */}
            <div className="flex justify-center">
              <div
                ref={cardRef}
                className="relative w-80 h-80 md:w-96 md:h-96 transition-transform duration-200 ease-out rounded-2xl overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/10 z-0" />
                <div className="absolute inset-4 z-10">
                  <Image
                    src="/images/nft.webp"
                    alt="Hyperfueled NFT"
                    width={384}
                    height={384}
                    className="rounded-xl object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Mint Panel */}
            <div className="space-y-8">
              <div>
                <AnimatedText
                  text="HyperFueled Genesis Collection"
                  className="font-headline text-4xl md:text-5xl font-bold mb-4"
                />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mint your exclusive HyperFueled Genesis NFT and join the elite early adopters in the Hyperliquid ecosystem.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-headline text-lg text-primary">Supply</span>
                  <span className="font-code text-xl">
                    {isLoadingTotalMinted || isLoadingMaxSupply ? 'Loading...' : `${supplyMinted} / ${totalSupply}`}
                  </span>
                </div>

                <Progress value={mintProgress} className="h-2" />

                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="font-headline text-lg text-primary">Price</span>
                  <span className="font-code text-2xl text-accent">
                    {isLoadingPricePerNft ? 'Loading...' : `${formatEther(pricePerNft)} HYPE`}
                  </span>
                </div>

                <Button
                  onClick={handleMint}
                  disabled={!isConnected || isMinting || isLoadingPricePerNft}
                  className="w-full h-14 text-lg font-headline bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                >
                  {isMinting ? 'Minting...' : 'Mint Now'}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Each wallet can mint multiple NFTs</p>
                <p>• All transactions are on Hyperliquid</p>
                <p>• NFTs are revealed immediately after mint</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </InteractiveWrapper>
  );
}
