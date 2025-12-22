import { create } from "zustand";

interface BearState {
  toggle: boolean;
  updateToggle: () => void;
}

const useToggle = create<BearState>((set) => ({
  toggle: false,
  updateToggle: () => set((state) => ({ toggle: !state.toggle })),
}));

export default useToggle;
