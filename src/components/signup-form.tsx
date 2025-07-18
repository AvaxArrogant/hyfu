
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { CheckCircle, Mail, Twitter, Facebook, Copy, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const walletFormSchema = z.object({
    walletAddress: z.string().min(1, { message: "Please enter a wallet address." }),
});

interface SignupFormProps {
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
  isConnected: boolean;
  onConnect: () => void;
}

export function SignupForm({ isSubmitted, setIsSubmitted, isConnected, onConnect }: SignupFormProps) {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const walletForm = useForm<z.infer<typeof walletFormSchema>>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
        walletAddress: "",
    },
  });


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    setIsSubmitted(true);
  }

  function onWalletSubmit(values: z.infer<typeof walletFormSchema>) {
    console.log("Wallet address submitted:", values);
    toast({
        title: "Wallet Address Saved!",
        description: "Your invites will now be tracked.",
    });
    // Generate a mock referral code on wallet submission
    setReferralCode(Math.random().toString(36).substring(2, 8));
    onConnect(); // Simulate connection
  }

  const referralLink = useMemo(() => {
    let base = "https://hyperfueled.trade";
    if (referralCode) {
      return `${base}?ref=${referralCode}`;
    }
    return base;
  }, [referralCode]);

  const shareText = "I just signed up for early access to Hyperfueled! Join me on the waitlist: " + referralLink;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share the link with your friends.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="mt-8 flex flex-col items-center text-center animate-fade-in">
        <CheckCircle className="h-16 w-16 text-accent" />
        <h3 className="mt-4 text-2xl font-headline font-bold text-primary">You're on the list!</h3>
        
        {!isConnected ? (
          <div className="w-full mt-4">
            <p className="mt-2 text-foreground/80">To track referrals, connect your wallet or enter your address:</p>
            <Form {...walletForm}>
                <form onSubmit={walletForm.handleSubmit(onWalletSubmit)} className="mt-4 space-y-4">
                    <FormField
                    control={walletForm.control}
                    name="walletAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            placeholder="Enter your wallet address / ENS"
                            className="h-12 bg-background/70 text-base ring-offset-background focus:ring-accent focus:ring-2"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Save Address</Button>
                        <span className="text-xs text-foreground/50 my-2 md:my-0">OR</span>
                        <Button type="button" onClick={() => {
                            setReferralCode(Math.random().toString(36).substring(2, 8));
                            onConnect();
                        }} variant="outline" className="w-full">
                           <Wallet className="mr-2 h-4 w-4" /> Connect
                        </Button>
                    </div>
                </form>
            </Form>
          </div>
        ) : (
            <>
                <p className="mt-2 text-foreground/80">Thank you for signing up. You can now invite your friends:</p>
                <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/10 text-center font-code break-words">
                    <p className="text-sm text-foreground/70">Your referral link:</p>
                    <p className="text-accent">{referralLink}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:?subject=Join me on Hyperfueled&body=${shareText}`} target="_blank" rel="noopener noreferrer" aria-label="Share via Email">
                    <Mail />
                    </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                    <Twitter />
                    </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                    <Facebook />
                    </a>
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy referral link">
                    <Copy />
                </Button>
                </div>
            </>
        )}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex flex-col md:flex-row gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-14 bg-background/70 text-lg ring-offset-background focus:ring-accent focus:ring-2 w-full"
                      {...field}
                    />
                     <Button type="submit" size="lg" className="h-14 w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                        Notify Me
                    </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
