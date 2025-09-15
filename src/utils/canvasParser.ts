import { CANVAS_RESOLUTION } from '@consts'
import type { JSONCanvas, SavedCanvas, StorageCanvas } from '@types'
import { JSONCanvasSchema } from '@/schemas/JSONCanvas'
import { generateId } from './generateId'
import { validateColor } from './validateColor'

type FromStorageParams = {
  id?: string
} & JSONCanvas

const fromStorage = (canvas: FromStorageParams | null): SavedCanvas | null => {
  if (!canvas) return null

  try {
    const { id, ...jsonCanvas } = canvas
    const { bg, pixels } = JSONCanvasSchema.parse(jsonCanvas)
    const pixelsArr = Array(CANVAS_RESOLUTION ** 2)

    // Fill with specific colors
    for (const [pixelColor, indexes] of Object.entries(pixels)) {
      for (const index of indexes) {
        const { isValid, value } = validateColor(pixelColor)
        if (isValid) pixelsArr[index] = value
      }
    }
    // Fill with background
    for (let i = 0; i < pixelsArr.length; i++) {
      if (!pixelsArr[i]) pixelsArr[i] = bg.toLowerCase()
    }
    // Handle id
    return { id: parseId(id), pixels: pixelsArr }
  } catch {
    console.error(
      `canvasParser.fromStorage: Error when attempting to parse canvas (id: ${canvas.id}) from storage. Canvas recieved:`,
      canvas
    )
    return null
  }
}

type ToStorageParams =
  | ({
      id?: string
    } & Omit<SavedCanvas, 'id'>)
  | string[]

const toStorage = (data: ToStorageParams | null): StorageCanvas | null => {
  if (!data) return null

  const { pixels, id } = 'pixels' in data ? data : { pixels: data }

  if (!pixels.length) {
    console.error(`canvasParser.toStorage: An empty canvas was given (id: ${id}).`)
    return null
  }

  const pixelsObj: any = {}

  pixels.forEach((pixelColor, i) => {
    const color = pixelColor.toLowerCase()
    const existingIndexes: number[] | undefined = pixelsObj[color]

    // Get the new index and keep the previous ones if they exist
    const indexArray = [i]
    if (existingIndexes) indexArray.unshift(...existingIndexes)

    pixelsObj[color] = indexArray
  })

  // Find the most frequent color and save it as the background
  const [bg] = Object.entries(pixelsObj).sort(([, a], [, b]) => (b as any).length - (a as any).length)[0]
  delete pixelsObj[bg]

  return { bg, pixels: pixelsObj, id: parseId(id) }
}

const batch =
  <T, R>(parser: (data: T) => R | null) =>
  (canvases: T[]): R[] => {
    const parsed: R[] = []
    for (const canvas of canvases) {
      try {
        const res = parser(canvas)
        if (res) parsed.push(res)
      } catch {}
    }
    return parsed
  }

const parseId = (id?: string) => id?.toString() ?? generateId()

/**
 * Parsers to convert canvases to and from storage format.
 * Includes batch methods for processing multiple canvases at once.
 *
 * - fromStorage: Converts a JSONCanvas from storage to a SavedCanvas.
 * - toStorage: Converts a SavedCanvas or pixel array to a StorageCanvas.
 * - batch: Contains batch methods for processing multiple canvases.
 */
export const canvasParser = {
  fromStorage,
  toStorage,
  batch: {
    fromStorage: batch(fromStorage),
    toStorage: batch(toStorage)
  }
}
