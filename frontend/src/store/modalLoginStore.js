"use client";

import { create } from "zustand";

const useModalLoginStore = create((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));

export default useModalLoginStore;