import { create } from 'zustand';

interface WizardState {
  step: number;
  oldPassword: string | null;
  setStep: (newStep: number) => void;
  setOldPassword: (password: string) => void;
  reset: () => void;
}

export const useWizard = create<WizardState>((set) => ({
  step: 1,
  oldPassword: null,
  setStep: (newStep) => set({ step: newStep }),
  setOldPassword: (password) => set({ oldPassword: password }),
  reset: () => set({ step: 1, oldPassword: null }),
}));