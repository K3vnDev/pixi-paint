import { BLANK_DRAFT } from '@consts'
import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { generateId } from '@/utils/generateId'
import { setState, type ValueOrCallback } from '@/utils/setState'

interface CanvasStore {
  savedCanvases: SavedCanvas[]
  setSavedCanvases: (state: ValueOrCallback<SavedCanvas[]>) => void

  draftCanvas: SavedCanvas
  setDraftCanvas: (state: ValueOrCallback<SavedCanvas>) => void

  setDraftCanvasPixels: (value: string[]) => void

  hydrated: boolean
  setHydrated: (state: ValueOrCallback<boolean>) => void

  editingCanvasId: string | null
  setEditingCanvasId: (state: ValueOrCallback<string | null>) => void

  showGrid: boolean
  setShowGrid: (state: ValueOrCallback<boolean>) => void

  getNewCanvasId: () => string
}

export const useCanvasesStore = create<CanvasStore>((set, get) => ({
  savedCanvases: [],
  setSavedCanvases: state =>
    set(s =>
      setState(s, 'savedCanvases', state, value => {
        const seenIds = new Set<string>()
        const newCanvases = value.map(canvas => {
          let { id } = canvas
          while (seenIds.has(id)) {
            id = generateId()
          }
          seenIds.add(id)
          return { ...canvas, id }
        })
        return newCanvases
      })
    ),

  draftCanvas: BLANK_DRAFT,
  setDraftCanvas: state => set(s => setState(s, 'draftCanvas', state)),

  setDraftCanvasPixels: value =>
    set(({ draftCanvas }) => {
      if (!value.length) return {}
      return { draftCanvas: { ...draftCanvas, pixels: value } }
    }),

  editingCanvasId: null,
  setEditingCanvasId: state => set(s => setState(s, 'editingCanvasId', state)),

  hydrated: false,
  setHydrated: state => set(s => setState(s, 'hydrated', state)),

  showGrid: false,
  setShowGrid: state => set(s => setState(s, 'showGrid', state)),

  getNewCanvasId: () => {
    const { savedCanvases } = get()
    return generateId(id => !savedCanvases.some(c => c.id === id))
  }
}))
