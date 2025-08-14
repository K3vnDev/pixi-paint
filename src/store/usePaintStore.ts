import { DEFAULT_COLOR, INITIAL_BG, TOOLS } from '@consts'
import type { PaintPixelData } from '@types'
import { create } from 'zustand'

interface PaintStore {
  tool: TOOLS
  setTool: (value: TOOLS) => void

  primaryColor: string
  setPrimaryColor: (value: string) => void

  secondaryColor: string
  setSecondaryColor: (value: string) => void

  pixels: string[]
  setPixels: (value: string[]) => void
  paintPixels: (...data: PaintPixelData[]) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  tool: TOOLS.BRUSH,
  setTool: value => set(() => ({ tool: value })),

  primaryColor: DEFAULT_COLOR,
  setPrimaryColor: value => set(() => ({ primaryColor: value })),

  secondaryColor: INITIAL_BG,
  setSecondaryColor: value => set(() => ({ secondaryColor: value })),

  pixels: [],
  setPixels: value => set(() => ({ pixels: value })),

  paintPixels: (...data) =>
    set(({ pixels }) => {
      const newPixels = structuredClone(pixels)

      for (const { index, color } of data) {
        const floorIndex = Math.floor(index)

        // Check if the index is within the range
        if (floorIndex < 0 || floorIndex >= newPixels.length) {
          console.warn(`Index out of range: ${floorIndex}`)
          continue
        }
        newPixels[floorIndex] = color
      }
      return { pixels: newPixels }
    })
}))
