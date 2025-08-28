import { BLANK_DRAFT } from '@consts'
import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { generateId } from '@/utils/generateId'

interface CanvasStore {
  savedCanvases: SavedCanvas[]
  setSavedCanvases: (value: SavedCanvas[]) => void

  draftCanvas: SavedCanvas
  setDraftCanvas: (value: SavedCanvas) => void
  setDraftCanvasPixels: (value: string[]) => void

  hydrated: boolean
  setHydrated: (value: boolean) => void

  editingCanvasId: string | null
  setEditingCanvasId: (value: string | null) => void

  showGrid: boolean
  setShowGrid: (value: boolean) => void

  getNewCanvasId: () => string
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  savedCanvases: [],
  setSavedCanvases: value => set(() => ({ savedCanvases: value })),

  draftCanvas: BLANK_DRAFT,
  setDraftCanvas: value => set(() => ({ draftCanvas: value })),
  setDraftCanvasPixels: value =>
    set(({ draftCanvas }) => ({ draftCanvas: { ...draftCanvas, pixels: value } })),

  editingCanvasId: null,
  setEditingCanvasId: value => set(() => ({ editingCanvasId: value })),

  hydrated: false,
  setHydrated: value => set(() => ({ hydrated: value })),

  showGrid: false,
  setShowGrid: value => set(() => ({ showGrid: value })),

  getNewCanvasId: () => {
    const { savedCanvases } = get()
    return generateId(id => !savedCanvases.some(c => c.id === id))
  }
}))
