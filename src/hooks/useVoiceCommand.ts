import { useEffect, useRef } from 'react';

import { interpretCommand } from '@/ai/agents';
import {
  attachVoiceListeners,
  startListening,
  stopListening,
} from '@/ai/voice-recognition';
import { database } from '@/db';
import { useVoiceStore, type CommandAction } from '@/store/voice-store';

export interface UseVoiceCommandOptions {
  repId: string;
  onActionReady?: (action: CommandAction) => void;
}

export interface UseVoiceCommandApi {
  toggle: () => Promise<void>;
}

export function useVoiceCommand(opts: UseVoiceCommandOptions): UseVoiceCommandApi {
  const state = useVoiceStore((s) => s.state);
  const setState = useVoiceStore((s) => s.setState);
  const setAction = useVoiceStore((s) => s.setAction);
  const setError = useVoiceStore((s) => s.setError);
  const reset = useVoiceStore((s) => s.reset);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    const detach = attachVoiceListeners({
      onFinal: async (transcript) => {
        try {
          setState('processing');
          const action = await interpretCommand({
            transcript,
            repId: optsRef.current.repId,
            db: database,
          });
          setAction(action);
          optsRef.current.onActionReady?.(action);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Voice processing failed');
        }
      },
      onError: (msg) => setError(msg),
    });
    return detach;
  }, [setState, setAction, setError]);

  const toggle = async (): Promise<void> => {
    if (state === 'listening') {
      await stopListening();
    } else if (state === 'idle' || state === 'error' || state === 'confirming') {
      reset();
      await startListening();
    }
  };

  return { toggle };
}
