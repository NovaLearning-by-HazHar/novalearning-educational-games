'use client';

import { useProgressSync } from '@/lib/useProgressSync';

/**
 * Mount this in the app layout to auto-sync progress
 * when a parent is authenticated and has selected a child.
 *
 * For MVP: no child selection — just mount to demonstrate the pattern.
 * When Supabase is configured and a parent logs in with a child,
 * pass the childId to activate real sync.
 */
export function ProgressSyncProvider({
  children,
  childId,
}: {
  children: React.ReactNode;
  childId?: string;
}) {
  // Hook is fully inert when unauthenticated or childId is undefined
  useProgressSync(childId);
  return <>{children}</>;
}
