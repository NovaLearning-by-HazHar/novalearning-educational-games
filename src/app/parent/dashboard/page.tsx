'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/useSupabaseAuth';
import { useProgressStore } from '@/stores/progressStore';
import { supabase } from '@/lib/supabase';

interface StudentItem {
  id: string;
  display_name: string;
  age: number | null;
  grade: string;
  avatar_emoji: string;
}

/** Game registry for display names */
const GAME_NAMES: Record<string, string> = {
  'count-to-five': 'Count to 5 with Sipho',
};

export default function ParentDashboardPage() {
  const { status, user, signOut } = useSupabaseAuth();
  const localProgress = useProgressStore((s) => s.completedGames);
  const [children, setChildren] = useState<StudentItem[]>([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(5);
  const [showAddChild, setShowAddChild] = useState(false);

  const fetchChildren = useCallback(async () => {
    if (!supabase || !user) return;
    const { data } = await supabase
      .from('students')
      .select('id, display_name, age, grade, avatar_emoji')
      .order('created_at', { ascending: true });
    if (data) setChildren(data);
  }, [user]);

  useEffect(() => {
    if (status === 'authenticated') fetchChildren();
  }, [status, fetchChildren]);

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user || !newChildName.trim()) return;

    await supabase.from('students').insert({
      parent_id: user.id,
      display_name: newChildName.trim(),
      age: newChildAge,
      grade: 'R',
      avatar_emoji: '\ud83e\udd81',
    });

    setNewChildName('');
    setShowAddChild(false);
    fetchChildren();
  };

  // Not authenticated — show local progress only
  if (status !== 'authenticated') {
    return (
      <main className="flex flex-col items-center min-h-screen p-6 bg-nova-sand overflow-auto">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-display text-nova-earth mb-2">Progress</h1>
          <p className="text-xs text-nova-earth/60 mb-6">
            Saved on this device. Sign in to sync across devices.
          </p>

          <LocalProgressView completedGames={localProgress} />

          <div className="mt-6 flex gap-3">
            <Link
              href="/parent/login"
              className="flex-1 py-3 rounded-xl bg-nova-leaf text-white font-display text-center hover:bg-nova-leaf/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl bg-nova-sand border border-nova-earth/20 text-nova-earth font-display text-center hover:bg-nova-sun/10 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated parent view
  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-nova-sand overflow-auto">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-nova-earth">Dashboard</h1>
            <p className="text-xs text-nova-earth/60">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-lg text-sm text-nova-earth/60 hover:text-nova-earth hover:bg-nova-earth/10 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Children list */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display text-nova-earth">Children</h2>
            <button
              onClick={() => setShowAddChild(!showAddChild)}
              className="px-3 py-1 rounded-lg text-sm bg-nova-sun/20 text-nova-earth hover:bg-nova-sun/30 transition-colors"
            >
              {showAddChild ? 'Cancel' : '+ Add Child'}
            </button>
          </div>

          {showAddChild && (
            <form onSubmit={addChild} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Child's name"
                className="flex-1 px-3 py-2 rounded-lg border border-nova-earth/20 bg-white text-sm text-nova-earth"
                required
              />
              <select
                value={newChildAge}
                onChange={(e) => setNewChildAge(Number(e.target.value))}
                className="px-2 py-2 rounded-lg border border-nova-earth/20 bg-white text-sm text-nova-earth"
              >
                {[4, 5, 6, 7].map((a) => (
                  <option key={a} value={a}>Age {a}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-nova-leaf text-white text-sm hover:bg-nova-leaf/90 transition-colors"
              >
                Add
              </button>
            </form>
          )}

          {children.length === 0 && !showAddChild && (
            <p className="text-sm text-nova-earth/50 bg-white/50 rounded-xl p-4 text-center">
              Add your child to start tracking their progress.
            </p>
          )}

          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-xl p-4 mb-2 border border-nova-earth/10 flex items-center gap-3"
            >
              <span className="text-2xl">{child.avatar_emoji}</span>
              <p className="font-display text-nova-earth">
                {child.display_name}
                {child.age && (
                  <span className="text-xs text-nova-earth/50 ml-2">Age {child.age} &middot; Grade {child.grade}</span>
                )}
              </p>
            </div>
          ))}
        </section>

        {/* Local progress */}
        <section className="mb-6">
          <h2 className="text-lg font-display text-nova-earth mb-3">Device Progress</h2>
          <LocalProgressView completedGames={localProgress} />
        </section>

        <Link
          href="/"
          className="block w-full py-3 rounded-xl bg-nova-sun text-nova-earth font-display text-center hover:bg-nova-sun/90 transition-colors"
        >
          Back to Games
        </Link>
      </div>
    </main>
  );
}

/** Shows local (Zustand) progress entries */
function LocalProgressView({
  completedGames,
}: {
  completedGames: { gameId: string; completedAt: string; interactions: number }[];
}) {
  if (completedGames.length === 0) {
    return (
      <p className="text-sm text-nova-earth/50 bg-white/50 rounded-xl p-4 text-center">
        No games completed yet. Play a game to see progress here!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {completedGames.map((g, i) => (
        <div key={i} className="bg-white rounded-xl p-3 border border-nova-earth/10 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {g.gameId === 'count-to-five' ? '🥭' : '🎮'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display text-nova-earth truncate">
              {GAME_NAMES[g.gameId] ?? g.gameId}
            </p>
            <p className="text-xs text-nova-earth/50">
              {new Date(g.completedAt).toLocaleDateString('en-ZA')} — {g.interactions} interactions
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
