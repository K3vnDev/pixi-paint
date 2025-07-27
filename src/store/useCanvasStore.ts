import { INITIAL_CANVAS, LS_DRAFT_KEY } from '@consts'
import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'

interface CanvasStore {
  savedCanvases: SavedCanvas[]
  setSavedCanvases: (value: SavedCanvas[]) => void

  draft: SavedCanvas
  setDraft: (value: SavedCanvas) => void

  editingCanvasId: string | null
  setEditingCanvasId: (value: string | null) => void
}

export const useCanvasStore = create<CanvasStore>(set => ({
  savedCanvases: [],
  setSavedCanvases: value => set(() => ({ savedCanvases: value })),

  draft: getLocalStorageItem<SavedCanvas>(LS_DRAFT_KEY, { id: 'draft', pixels: INITIAL_CANVAS }),

  setDraft: value =>
    set(() => {
      window.localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(value))
      return { draft: value }
    }),

  editingCanvasId: null,
  setEditingCanvasId: value => set(() => ({ editingCanvasId: value }))
}))
