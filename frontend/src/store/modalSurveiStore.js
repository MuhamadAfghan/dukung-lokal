"use client";

import { create } from "zustand";

const useModalSurveiStore = create((set) => ({
  isSurveiModalOpen: false,
  openSurveiModal: () => set({ isSurveiModalOpen: true }),
  closeSurveiModal: () => set({ isSurveiModalOpen: false }),
}));

export default useModalSurveiStore;
