'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AuthStatus } from '@/types/game';

/**
 * Supabase auth state hook (Pattern 2: Connection State Machine).
 *
 * Adapts useMCPConnection's isConnected/isInitializing/connectionError
 * into a parent-facing auth flow. Children play anonymously;
 * parents log in to enable progress sync.
 *
 * When supabase is null (no env vars): returns anonymous permanently.
 */
export function useSupabaseAuth() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUser] = useState<User | null>(null);

  // Initialize: check existing session
  useEffect(() => {
    if (!supabase) {
      setStatus('anonymous');
      return;
    }

    setStatus('loading');

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setStatus('authenticated');
      } else {
        setStatus('anonymous');
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('anonymous');
        }
      }
    );

    return () => { subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: new Error('Supabase not configured') };
      setStatus('loading');
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setStatus('anonymous');
      return result;
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: new Error('Supabase not configured') };
      setStatus('loading');
      const result = await supabase.auth.signUp({ email, password });
      if (result.error) setStatus('anonymous');
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setStatus('anonymous');
  }, []);

  return { status, user, signIn, signUp, signOut };
}
