'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/useSupabaseAuth';

type Mode = 'login' | 'signup';

export default function ParentLoginPage() {
  const { status, signIn, signUp } = useSupabaseAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isLoading = status === 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (mode === 'signup') {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error.message);
      }
    }
  };

  // Redirect after auth
  if (status === 'authenticated') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-nova-sand overflow-auto">
        <div className="w-full max-w-sm text-center">
          <p className="text-lg font-display text-nova-earth mb-4">Welcome!</p>
          <Link
            href="/parent/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-nova-leaf text-white font-display hover:bg-nova-leaf/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Success after signup (email confirmation needed)
  if (success) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-nova-sand overflow-auto">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-display text-nova-earth mb-4">Check Your Email</h1>
          <p className="text-sm text-nova-earth/70 mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={() => { setSuccess(false); setMode('login'); }}
            className="px-6 py-3 rounded-xl bg-nova-sky text-white font-display hover:bg-nova-sky/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  // No Supabase configured
  if (status === 'anonymous') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-nova-sand overflow-auto">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-display text-nova-earth mb-4">Parent Portal</h1>
          <p className="text-sm text-nova-earth/70 mb-6">
            Parent accounts are not yet available. Your child&apos;s progress is saved on this device.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-nova-sun text-nova-earth font-display hover:bg-nova-sun/90 transition-colors"
          >
            Back to Games
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-nova-sand overflow-auto">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-display text-nova-earth mb-2 text-center">
          {mode === 'login' ? 'Parent Login' : 'Create Account'}
        </h1>
        <p className="text-xs text-nova-earth/60 mb-6 text-center">
          Track your child&apos;s learning progress
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-display text-nova-earth mb-1">
                Your Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-nova-earth/20 bg-white text-nova-earth focus:outline-none focus:ring-2 focus:ring-nova-sky"
                placeholder="e.g. Mama Sipho"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-display text-nova-earth mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-nova-earth/20 bg-white text-nova-earth focus:outline-none focus:ring-2 focus:ring-nova-sky"
              placeholder="parent@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-display text-nova-earth mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-nova-earth/20 bg-white text-nova-earth focus:outline-none focus:ring-2 focus:ring-nova-sky"
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-nova-leaf text-white font-display text-lg hover:bg-nova-leaf/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
            className="text-sm text-nova-sky hover:underline"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-nova-earth/50 hover:underline">
            Back to Games
          </Link>
        </div>
      </div>
    </main>
  );
}
