import type { SavedCanvas } from '@types'
import { create } from 'zustand'
import { dataFetch } from '@/utils/dataFetch'
import { setState, type ValueOrCallback } from '@/utils/setState'

export enum UPI_COOLDOWN {
  INSTANT = 0,
  DEFAULT = 30000
}

interface RemoteStore {
  publishedCanvases: SavedCanvas[]
  setPublishedCanvases: (state: ValueOrCallback<SavedCanvas[]>) => void

  userPublishedIds: Set<string> | null | undefined
  setUserPublishedIds: (state: ValueOrCallback<RemoteStore['userPublishedIds']>) => void

  refreshUPI: (savedCanvases: SavedCanvas[]) => void

  nextUPIRefresh: number
  setUPIRefreshCooldown: (value: UPI_COOLDOWN) => void
}

export const useRemoteStore = create<RemoteStore>((set, get) => ({
  publishedCanvases: [],
  setPublishedCanvases: state => set(s => setState(s, 'publishedCanvases', state)),

  userPublishedIds: undefined,
  setUserPublishedIds: value => set(s => setState(s, 'userPublishedIds', value)),

  refreshUPI: savedCanvases => {
    const { setUserPublishedIds, setUPIRefreshCooldown } = get()
    setUPIRefreshCooldown(UPI_COOLDOWN.DEFAULT)

    dataFetch<string[]>({
      url: 'api/paintings/check',
      method: 'POST',
      json: savedCanvases,
      onSuccess: ids => setUserPublishedIds(new Set(ids)),
      onError: () => setUserPublishedIds(null)
    })
  },

  nextUPIRefresh: Date.now(),
  setUPIRefreshCooldown: value =>
    set(() => {
      const nextUPIRefresh = Date.now() + +value
      return { nextUPIRefresh }
    })
}))
