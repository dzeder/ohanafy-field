import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { getVisitInsight, type VisitInsight } from '@/ai/agents';
import { database } from '@/db';
import type { Account } from '@/db/models/Account';

interface InsightBannerProps {
  account: Account;
}

const URGENCY_BG: Record<VisitInsight['urgency'], string> = {
  high: 'bg-ohanafy-mellow',
  medium: 'bg-ohanafy-denim-light',
  low: 'bg-ohanafy-cork dark:bg-ohanafy-dark-elevated',
};

const URGENCY_TEXT: Record<VisitInsight['urgency'], string> = {
  high: 'text-ohanafy-ink',
  medium: 'text-ohanafy-ink',
  low: 'text-ohanafy-ink dark:text-ohanafy-dark-text',
};

export function InsightBanner({ account }: InsightBannerProps): React.ReactNode {
  const [insight, setInsight] = useState<VisitInsight | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // The agent has its own 3-sec internal timeout; if AI doesn't return in
    // time, we still get the deterministic fallback. Do not block render.
    getVisitInsight({ account, db: database })
      .then((result) => {
        if (!cancelled) setInsight(result);
      })
      .catch(() => {
        if (!cancelled) setHidden(true);
      });
    return () => {
      cancelled = true;
    };
  }, [account]);

  if (hidden || !insight) return null;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={`Pre-call insight, ${insight.urgency} urgency: ${insight.headline}. ${insight.reason}. ${insight.suggestedAction}`}
      accessibilityLiveRegion="polite"
      className={`mb-4 rounded-2xl ${URGENCY_BG[insight.urgency]} p-4`}
    >
      <Text className={`text-xs font-bold uppercase tracking-wider ${URGENCY_TEXT[insight.urgency]} opacity-70`}>
        Pre-call insight · {insight.urgency} priority
      </Text>
      <Text className={`mt-1 text-lg font-bold ${URGENCY_TEXT[insight.urgency]}`}>
        {insight.headline}
      </Text>
      <Text className={`mt-2 text-sm ${URGENCY_TEXT[insight.urgency]}`}>
        {insight.reason}
      </Text>
      <Text className={`mt-2 text-sm font-bold ${URGENCY_TEXT[insight.urgency]}`}>
        {insight.suggestedAction}
      </Text>
    </View>
  );
}
