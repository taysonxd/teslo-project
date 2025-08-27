import { create } from 'zustand'

type Store = {
    isSideMenuOpen: boolean;
    openSideMenu: () => void;
    closeSideMenu: () => void;
}

export const useUiStore = create<Store>()((set) => ({
  isSideMenuOpen: false,
  openSideMenu: () => set((state) => ({ isSideMenuOpen: true })),
  closeSideMenu: () => set((state) => ({ isSideMenuOpen: false })),
}))

