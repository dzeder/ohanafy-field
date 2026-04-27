import { create } from 'zustand';

export type VoiceStateName =
  | 'idle'
  | 'requesting_permission'
  | 'listening'
  | 'processing'
  | 'confirming'
  | 'error';

export type CommandAction =
  | { type: 'ADD_TO_ORDER'; items: AddToOrderItem[]; summary: string }
  | { type: 'LOG_NOTE'; note: string; rawTranscript: string; summary: string }
  | { type: 'UNKNOWN'; transcript: string; summary: string };

export interface AddToOrderItem {
  productSfId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  confidence: 'high' | 'medium' | 'low';
}

interface VoiceStore {
  state: VoiceStateName;
  transcript: string;
  interimTranscript: string;
  action: CommandAction | null;
  error: string | null;

  setState: (next: VoiceStateName) => void;
  setTranscript: (text: string, isInterim: boolean) => void;
  setAction: (action: CommandAction) => void;
  setError: (message: string) => void;
  reset: () => void;
}

const INITIAL: Pick<VoiceStore, 'state' | 'transcript' | 'interimTranscript' | 'action' | 'error'> = {
  state: 'idle',
  transcript: '',
  interimTranscript: '',
  action: null,
  error: null,
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  ...INITIAL,

  setState: (next) => set({ state: next, error: next === 'error' ? null : null }),
  setTranscript: (text, isInterim) =>
    set(isInterim ? { interimTranscript: text } : { transcript: text, interimTranscript: '' }),
  setAction: (action) => set({ action, state: 'confirming' }),
  setError: (message) => set({ error: message, state: 'error' }),
  reset: () => set({ ...INITIAL }),
}));
