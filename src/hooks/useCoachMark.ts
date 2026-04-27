import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const KEY_PREFIX = 'coach_mark_dismissed_';

export interface CoachMarkApi {
  visible: boolean;
  dismiss: () => Promise<void>;
}

export function useCoachMark(markId: string): CoachMarkApi {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(KEY_PREFIX + markId).then((value) => {
      if (active) setVisible(value !== '1');
    });
    return () => {
      active = false;
    };
  }, [markId]);

  const dismiss = async (): Promise<void> => {
    await SecureStore.setItemAsync(KEY_PREFIX + markId, '1');
    setVisible(false);
  };

  return { visible, dismiss };
}
