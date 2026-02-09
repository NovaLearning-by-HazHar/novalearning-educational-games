'use client';

import { useProgressSync } from '@/lib/useProgressSync';

/**
 * Mount this in the app layout to auto-sync progress
 * when a parent is authenticated and has selected a student.
 *
 * For MVP: no student selection — just mount to demonstrate the pattern.
 * When Supabase is configured and a parent logs in with a student,
 * pass the studentId to activate real sync.
 */
export function ProgressSyncProvider({
  children,
  studentId,
}: {
  children: React.ReactNode;
  studentId?: string;
}) {
  // Hook is fully inert when unauthenticated or studentId is undefined
  useProgressSync(studentId);
  return <>{children}</>;
}
