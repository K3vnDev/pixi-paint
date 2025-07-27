import { INITIAL_BG, MODES } from '@consts'
import type { Pixel } from '@types'
import { create } from 'zustand'

interface PaintStore {
  mode: MODES
  setMode: (value: MODES) => void

  color: string
  setColor: (value: string) => void

  bgColor: string
  setBgColor: (value: string) => void

  canvas: Pixel[]
  setCanvas: (value: Pixel[]) => void
  setCanvasPixel: (index: number, value: Pixel) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  mode: MODES.NONE,
  setMode: value => set(() => ({ mode: value })),

  color: '#eb4034',
  setColor: value => set(() => ({ color: value })),

  bgColor: INITIAL_BG,
  setBgColor: value => set(() => ({ bgColor: value })),

  canvas: [],
  setCanvas: value => set(() => ({ canvas: value })),

  setCanvasPixel: (index, value) =>
    set(({ canvas }) => {
      const newCanvas = structuredClone(canvas)
      const roundedIndex = Math.round(index)

      // Check if the index is within the range
      if (roundedIndex < 0 || roundedIndex >= newCanvas.length) {
        console.warn(`Index out of range: ${roundedIndex}`)
        return {}
      }

      newCanvas[roundedIndex] = value
      return { canvas: newCanvas }
    })
}))
