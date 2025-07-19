'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayAddress: string;
  invites: number;
  isHypeDomain: boolean;
}

interface LeaderboardProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function Leaderboard({ isOpen, onOpenChange }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Create client-side supabase instance
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data, error } = await supabase.functions.invoke('leaderboard');
      
      if (error) {
        console.error('Supabase function error:', error);
        return;
      }
      
      if (data && data.leaderboard) {
        setLeaderboardData(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback method using direct fetch if supabase client fails
  const fetchLeaderboardFallback = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/functions/v1/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setLeaderboardData(data.leaderboard || []);
      } else {
        console.error('Leaderboard fetch failed:', data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-black/80 backdrop-blur-sm border-r border-white/10 text-white w-[400px] sm:w-[540px] p-0">
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <Trophy className="text-accent" />
              Invite Leaderboard
            </SheetTitle>
            <SheetDescription className="text-foreground/80">
              Top 10 referrers. Invite friends to climb the ranks!
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : (
              <Table>
                  <TableHeader>
                      <TableRow className="border-b-white/20 hover:bg-white/5">
                          <TableHead className="w-[50px] text-white/80">Rank</TableHead>
                          <TableHead className="text-white/80">Address / ENS</TableHead>
                          <TableHead className="text-right text-white/80">Invites</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {leaderboardData.length > 0 ? leaderboardData.map((user) => (
                      <TableRow key={user.rank} className="border-b-white/10 hover:bg-white/5">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {user.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
                              {user.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-code">
                            <div className="flex items-center gap-2">
                              {user.isHypeDomain && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                  .hype
                                </span>
                              )}
                              {user.displayAddress}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-accent">{user.invites}</TableCell>
                      </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-foreground/60">
                            No referrals yet. Be the first!
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
              </Table>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}