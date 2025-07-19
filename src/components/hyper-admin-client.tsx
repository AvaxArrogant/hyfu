'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Flame } from 'lucide-react';
import { InteractiveWrapper } from '@/components/interactive-wrapper';
import { supabase } from '@/lib/supabase';

interface AdminData {
  totalSignups: number;
  totalInvites: number;
  conversionRate: string;
  topReferrers: Array<{
    rank: number;
    address: string;
    invites: number;
    signups: number;
  }>;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fueledhyper184763') {
      setIsAuthenticated(true);
      setError('');
      fetchAdminData();
    } else {
      setError('Incorrect password.');
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-stats`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAdminData(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading || !adminData) {
    return (
      <InteractiveWrapper>
        <div className="relative z-10 min-h-screen p-4 md:p-8 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </InteractiveWrapper>
    );
  }

  return (
    <InteractiveWrapper>
      <div className="relative z-10 min-h-screen p-4 md:p-8 text-white">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <Flame /> Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAdminData}>Refresh</Button>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{adminData.totalSignups}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{adminData.totalInvites}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground/80">Referral Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{adminData.conversionRate}</p>
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
                  {adminData.topReferrers.length > 0 ? adminData.topReferrers.map((user) => (
                    <TableRow key={user.rank} className="border-b-white/10 hover:bg-white/5">
                      <TableCell className="font-medium">{user.rank}</TableCell>
                      <TableCell className="font-code">{user.address}</TableCell>
                      <TableCell className="text-right font-bold text-accent">{user.invites}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{user.signups}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-foreground/60">
                        No referrers yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </InteractiveWrapper>
  );
}
