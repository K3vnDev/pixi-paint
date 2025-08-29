import type { SavedCanvas } from '@types'
import { canvasParser } from './canvasParser'

export const isCanvasEmpty = (canvas: SavedCanvas) => {
  const { pixels } = canvasParser.toStorage(canvas)
  const obj = Object.entries(pixels)
  return !obj.length
}
