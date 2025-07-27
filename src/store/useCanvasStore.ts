import { BLANK_DRAFT, LS_DRAFT_KEY, LS_SAVED_CANVASES_KEY } from '@consts'
import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'

interface CanvasStore {
  savedCanvases: SavedCanvas[]
  setSavedCanvases: (value: SavedCanvas[]) => void

  draft: SavedCanvas
  setDraft: (value: SavedCanvas) => void

  hydrate: () => void
  hydrated: boolean

  editingCanvasId: string | null
  setEditingCanvasId: (value: string | null) => void
}

export const useCanvasStore = create<CanvasStore>(set => ({
  savedCanvases: [],
  setSavedCanvases: value =>
    set(() => {
      window.localStorage.setItem(LS_SAVED_CANVASES_KEY, JSON.stringify(value))
      return { savedCanvases: value }
    }),

  draft: BLANK_DRAFT,
  setDraft: value =>
    set(() => {
      window.localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(value))
      return { draft: value }
    }),

  hydrated: false,
  hydrate: () =>
    set(() => ({
      savedCanvases: getLocalStorageItem<SavedCanvas[]>(LS_SAVED_CANVASES_KEY, []),
      draft: getLocalStorageItem<SavedCanvas>(LS_DRAFT_KEY, BLANK_DRAFT),
      hydrated: true
    })),

  editingCanvasId: null,
  setEditingCanvasId: value => set(() => ({ editingCanvasId: value }))
}))
