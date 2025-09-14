import { CANVAS_RESOLUTION } from '@consts'
import type { SavedCanvas, StorageCanvas } from '@types'
import { JSONCanvasSchema } from '@/schemas/JSONCanvas'
import { generateId } from './generateId'
import { validateColor } from './validateColor'

export const canvasParser = {
  fromStorage: ({ id: rawId, ...jsonCanvas }: StorageCanvas): SavedCanvas | null => {
    try {
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
      const id = typeof rawId === 'string' ? rawId : generateId()

      return { id, pixels: pixelsArr }
    } catch {
      console.error(
        `canvasParser.fromStorage: Error when attempting to parse canvas (id: ${rawId}) from storage. Canvas recieved:`,
        { rawId, ...jsonCanvas }
      )
      return null
    }
  },

  toStorage: ({ id, pixels }: SavedCanvas): StorageCanvas | null => {
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

    return { bg, pixels: pixelsObj, id }
  }
}
