
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

// Mock data for the leaderboard
const leaderboardData = [
  { rank: 1, address: "0x1234...abcd", invites: 150 },
  { rank: 2, address: "hyperfueled.hype", invites: 125 },
  { rank: 3, address: "0x5678...efgh", invites: 110 },
  { rank: 4, address: "0x9abc...ijkl", invites: 95 },
  { rank: 5, address: "0xdef0...mnop", invites: 82 },
  { rank: 6, address: "future.hype", invites: 70 },
  { rank: 7, address: "0x1a2b...3c4d", invites: 65 },
  { rank: 8, address: "0x5e6f...7g8h", invites: 53 },
  { rank: 9, address: "king.hype", invites: 48 },
  { rank: 10, address: "0x9i0j...1k2l", invites: 42 },
];

interface LeaderboardProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function Leaderboard({ isOpen, onOpenChange }: LeaderboardProps) {
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
              <Table>
                  <TableHeader>
                      <TableRow className="border-b-white/20 hover:bg-white/5">
                          <TableHead className="w-[50px] text-white/80">Rank</TableHead>
                          <TableHead className="text-white/80">Address / ENS</TableHead>
                          <TableHead className="text-right text-white/80">Invites</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {leaderboardData.map((user) => (
                      <TableRow key={user.rank} className="border-b-white/10 hover:bg-white/5">
                          <TableCell className="font-medium">{user.rank}</TableCell>
                          <TableCell className="font-code">{user.address}</TableCell>
                          <TableCell className="text-right font-bold text-accent">{user.invites}</TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
