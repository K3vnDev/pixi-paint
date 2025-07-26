import { MODES, PIXEL_ART_RES } from '@consts'
import type { Pixel } from '@types'
import { create } from 'zustand'

interface PaintStore {
  mode: MODES
  setMode: (value: MODES) => void

  color: string
  setColor: (value: string) => void

  canvas: Pixel[]
  setCanvas: (value: Pixel[]) => void
  setCanvasPixel: (index: number, value: Pixel) => void
  paintCanvasPixel: (index: number, color?: string) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  mode: MODES.NONE,
  setMode: value => set(() => ({ mode: value })),

  color: '#eb4034',
  setColor: value => set(() => ({ color: value })),

  canvas: Array.from({ length: PIXEL_ART_RES ** 2 }, () => ({ color: '#FFF' })),
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
    }),

  paintCanvasPixel: (index, color) =>
    set(({ canvas, color: selectedColor }) => {
      const newCanvas = structuredClone(canvas)
      const roundedIndex = Math.round(index)

      // Check if the index is within the range
      if (roundedIndex < 0 || roundedIndex >= newCanvas.length) {
        console.warn(`Index out of range: ${roundedIndex}`)
        return {}
      }

      const paintingColor = color ?? selectedColor
      newCanvas[roundedIndex].color = paintingColor
      return { canvas: newCanvas }
    })
}))
