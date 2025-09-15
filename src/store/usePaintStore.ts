import { DEFAULT_PRI_COLOR, DEFAULT_SEC_COLOR, TOOLS } from '@consts'
import type { PaintPixelData } from '@types'
import { create } from 'zustand'
import { setState, type ValueOrCallback } from '@/utils/setState'

interface PaintStore {
  tool: TOOLS
  setTool: (state: ValueOrCallback<TOOLS>) => void

  primaryColor: string
  setPrimaryColor: (state: ValueOrCallback<string>) => void

  secondaryColor: string
  setSecondaryColor: (state: ValueOrCallback<string>) => void

  pixels: string[]
  setPixels: (state: ValueOrCallback<string[]>) => void
  paintPixels: (...data: PaintPixelData[]) => void
}

export const usePaintStore = create<PaintStore>(set => ({
  tool: TOOLS.BRUSH,
  setTool: state => set(s => setState(s, 'tool', state)),

  primaryColor: DEFAULT_PRI_COLOR,
  setPrimaryColor: state => set(s => setState(s, 'primaryColor', state)),

  secondaryColor: DEFAULT_SEC_COLOR,
  setSecondaryColor: state => set(s => setState(s, 'secondaryColor', state)),

  pixels: [],
  setPixels: state => set(s => setState(s, 'pixels', state)),

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
