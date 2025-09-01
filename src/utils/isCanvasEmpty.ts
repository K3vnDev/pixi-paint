import type { SavedCanvas } from '@types'
import { canvasParser } from './canvasParser'

export const isCanvasEmpty = (canvas: SavedCanvas) => {
  const storageCanvas = canvasParser.toStorage(canvas)
  if (!storageCanvas) return false

  const { pixels } = storageCanvas
  const obj = Object.entries(pixels)
  return !obj.length
}
