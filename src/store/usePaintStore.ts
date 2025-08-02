import { COLOR_PALETTE, INITIAL_BG, TOOLS } from '@consts'
import { create } from 'zustand'
import type { PaintPixelData } from '@/types'

interface PaintStore {
  tool: TOOLS
  setTool: (value: TOOLS) => void

  color: string
  setColor: (value: string) => void

  bgColor: string
  setBgColor: (value: string) => void

  pixels: string[]
  setPixels: (value: string[]) => void
  paintPixels: (...data: PaintPixelData[]) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  tool: TOOLS.BRUSH,
  setTool: value => set(() => ({ tool: value })),

  color: COLOR_PALETTE.RED,
  setColor: value => set(() => ({ color: value })),

  bgColor: INITIAL_BG,
  setBgColor: value => set(() => ({ bgColor: value })),

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
