import { create } from 'zustand'

interface GeneralStore {
  isUsingInput: boolean
  setIsUsingInput: (value: boolean) => void
}

export const useGeneralStore = create<GeneralStore>(set => ({
  isUsingInput: false,
  setIsUsingInput: value => set(() => ({ isUsingInput: value }))
}))
