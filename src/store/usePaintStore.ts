import { COLOR_PALETTE, INITIAL_BG, TOOLS } from '@consts'
import type { Pixel } from '@types'
import { create } from 'zustand'

interface PaintStore {
  tool: TOOLS
  setTool: (value: TOOLS) => void

  color: string
  setColor: (value: string) => void

  bgColor: string
  setBgColor: (value: string) => void

  pixels: Pixel[]
  setPixels: (value: Pixel[]) => void
  setPixelsPixel: (index: number, value: Pixel) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  tool: TOOLS.NONE,
  setTool: value => set(() => ({ tool: value })),

  color: COLOR_PALETTE.RED,
  setColor: value => set(() => ({ color: value })),

  bgColor: INITIAL_BG,
  setBgColor: value => set(() => ({ bgColor: value })),

  pixels: [],
  setPixels: value => set(() => ({ pixels: value })),

  setPixelsPixel: (index, value) =>
    set(({ pixels: canvas }) => {
      const newCanvas = structuredClone(canvas)
      const roundedIndex = Math.round(index)

      // Check if the index is within the range
      if (roundedIndex < 0 || roundedIndex >= newCanvas.length) {
        console.warn(`Index out of range: ${roundedIndex}`)
        return {}
      }

      newCanvas[roundedIndex] = value
      return { pixels: newCanvas }
    })
}))
