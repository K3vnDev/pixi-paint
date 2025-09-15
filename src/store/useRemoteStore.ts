import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { setState, type ValueOrCallback } from '@/utils/setState'

interface RemoteStore {
  publishedCanvases: SavedCanvas[]
  setPublishedCanvases: (state: ValueOrCallback<SavedCanvas[]>) => void

  userPublishedCanvasesIds: Set<string> | null | undefined
  setUserPublishedCanvasesIds: (state: ValueOrCallback<RemoteStore['userPublishedCanvasesIds']>) => void
}

export const useRemoteStore = create<RemoteStore>(set => ({
  publishedCanvases: [],
  setPublishedCanvases: state => set(s => setState(s, 'publishedCanvases', state)),

  userPublishedCanvasesIds: undefined,
  setUserPublishedCanvasesIds: value => set(s => setState(s, 'userPublishedCanvasesIds', value))
}))
