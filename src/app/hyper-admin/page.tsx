
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Flame } from 'lucide-react';
import { InteractiveWrapper } from '@/components/interactive-wrapper';

const mockAdminData = {
  totalSignups: 1258,
  totalInvites: 843,
  conversionRate: '67.01%',
  topReferrers: [
    { rank: 1, address: "0x1234...abcd", invites: 150, signups: 120 },
    { rank: 2, address: "hyperfueled.hype", invites: 125, signups: 101 },
    { rank: 3, address: "0x5678...efgh", invites: 110, signups: 98 },
    { rank: 4, address: "0x9abc...ijkl", invites: 95, signups: 76 },
    { rank: 5, address: "trader.hype", invites: 82, signups: 65 },
  ],
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hyperpass1') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
                <Flame /> HyperFueled Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                    Enter Access Code
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*******"
                    className="h-12 bg-background/70 text-base ring-offset-background focus:ring-accent focus:ring-2"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <InteractiveWrapper>
      <div className="relative z-10 min-h-screen p-4 md:p-8 text-white">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <Flame /> Admin Dashboard
          </h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{mockAdminData.totalSignups}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{mockAdminData.totalInvites}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Referral Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{mockAdminData.conversionRate}</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-white/20 hover:bg-white/5">
                    <TableHead className="w-[50px] text-white/80">Rank</TableHead>
                    <TableHead className="text-white/80">Address / ENS</TableHead>
                    <TableHead className="text-right text-white/80">Total Invites</TableHead>
                    <TableHead className="text-right text-white/80">Successful Signups</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminData.topReferrers.map((user) => (
                    <TableRow key={user.rank} className="border-b-white/10 hover:bg-white/5">
                      <TableCell className="font-medium">{user.rank}</TableCell>
                      <TableCell className="font-code">{user.address}</TableCell>
                      <TableCell className="text-right font-bold text-accent">{user.invites}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{user.signups}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </InteractiveWrapper>
  );
}
