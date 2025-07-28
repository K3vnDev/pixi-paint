import { COLOR_PALETTE, INITIAL_BG, TOOLS } from '@consts'
import { create } from 'zustand'

interface PaintStore {
  tool: TOOLS
  setTool: (value: TOOLS) => void

  color: string
  setColor: (value: string) => void

  bgColor: string
  setBgColor: (value: string) => void

  pixels: string[]
  setPixels: (value: string[]) => void
  setPixelsPixel: (index: number, value: string) => void
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
      const newPixels = structuredClone(canvas)
      const floorIndex = Math.floor(index)

      // Check if the index is within the range
      if (floorIndex < 0 || floorIndex >= newPixels.length) {
        console.warn(`Index out of range: ${floorIndex}`)
        return {}
      }

      newPixels[floorIndex] = value
      return { pixels: newPixels }
    })
}))
