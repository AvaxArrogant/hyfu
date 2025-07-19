'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignupFormProps {
  isSubmitted: boolean;
  setIsSubmitted: (v: boolean) => void;
  searchParams?: { ref: string | null };
}

export function SignupForm({ isSubmitted, setIsSubmitted, searchParams }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referredByCode: searchParams?.ref ?? undefined }),
      });
      if (!res.ok) {
        throw new Error('Request failed');
      }
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return <p className="text-green-500">Thanks for signing up!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
        {loading ? 'Submitting...' : 'Join Waitlist'}
      </Button>
    </form>
  );
}
