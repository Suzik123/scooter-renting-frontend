import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { hasRecentPending, usePaymentsHistoryStore } from '../stores/paymentsHistoryStore';

const POLL_INTERVAL_MS = 10_000;

/**
 * While the authenticated user has at least one pending payment in the last
 * 24h, polls `/api/users/:id/payments` every 10s to reconcile async
 * webhook-driven status changes.
 *
 * Mount once near the app shell.
 */
export function usePaymentsPolling(): void {
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const items = usePaymentsHistoryStore((s) => s.items);
  const pollPending = usePaymentsHistoryStore((s) => s.pollPending);

  // Drive the effect by a primitive (boolean) so we don't poll on every items
  // mutation — only when "has pending" actually flips.
  const shouldPoll = hasRecentPending(items);

  useEffect(() => {
    if (!userId || !shouldPoll) return;
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      const stillPending = await pollPending(userId);
      if (cancelled) return;
      if (!stillPending) return; // exit loop by leaving the interval scheduled but no-op
    };
    const id = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [userId, shouldPoll, pollPending]);
}
