import { INITIAL_CANVAS } from '@consts'
import type { SavedCanvas } from '@types'
import { create } from 'zustand'

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

  draft: {
    id: 'draft',
    pixels: INITIAL_CANVAS
  },

  setDraft: value => set(() => ({ draft: value })),

  editingCanvasId: null,
  setEditingCanvasId: value => set(() => ({ editingCanvasId: value }))
}))
