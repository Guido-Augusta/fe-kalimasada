import { create } from 'zustand';

type ProgressMode = 'surah' | 'juz';

interface ProgressModeState {
  mode: ProgressMode;
  setMode: (mode: ProgressMode) => void;
  reset: () => void;
}

const initialState = {
  mode: 'surah' as ProgressMode,
};

export const useProgressModeStore = create<ProgressModeState>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  reset: () => set(initialState),
}));
