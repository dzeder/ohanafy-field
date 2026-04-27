import Voice, {
  type SpeechErrorEvent,
  type SpeechResultsEvent,
} from '@react-native-voice/voice';

import { useVoiceStore } from '@/store/voice-store';

interface VoiceListenerHandlers {
  onFinal: (transcript: string) => void;
  onError: (message: string) => void;
}

let activeHandlers: VoiceListenerHandlers | null = null;

const handleResults = (event: SpeechResultsEvent): void => {
  const text = event.value?.[0] ?? '';
  if (!text) return;
  useVoiceStore.getState().setTranscript(text, false);
  activeHandlers?.onFinal(text);
};

const handlePartialResults = (event: SpeechResultsEvent): void => {
  const text = event.value?.[0] ?? '';
  if (text) useVoiceStore.getState().setTranscript(text, true);
};

const handleError = (event: SpeechErrorEvent): void => {
  const code = event.error?.code ?? 'unknown';
  const human = code === '7' || code === 'NoMatch' ? "Didn't catch that" : 'Voice error';
  useVoiceStore.getState().setError(human);
  activeHandlers?.onError(human);
};

export function attachVoiceListeners(handlers: VoiceListenerHandlers): () => void {
  activeHandlers = handlers;
  Voice.onSpeechResults = handleResults;
  Voice.onSpeechPartialResults = handlePartialResults;
  Voice.onSpeechError = handleError;
  return () => {
    activeHandlers = null;
    Voice.removeAllListeners();
    Voice.destroy().catch(() => undefined);
  };
}

export async function startListening(locale = 'en-US'): Promise<void> {
  useVoiceStore.getState().setState('listening');
  await Voice.start(locale);
}

export async function stopListening(): Promise<void> {
  useVoiceStore.getState().setState('processing');
  await Voice.stop();
}
