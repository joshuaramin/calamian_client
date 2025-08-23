import { create } from "zustand";

interface BearState {
  search: string;
  updateSearch: (value: string) => void;
}

const useSearch = create<BearState>((set) => ({
  search: "",
  updateSearch: (value) =>
    set(() => ({
      search: value,
    })),
}));

export default useSearch;
