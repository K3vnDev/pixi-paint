import { CANVAS_RESOLUTION } from '@consts'
import type { SavedCanvas, StorageCanvas } from '@types'

export const canvasParser = {
  fromStorage: ({ pixels, bg, id }: StorageCanvas): SavedCanvas | null => {
    try {
      const pixelsArr = Array(CANVAS_RESOLUTION ** 2)

      for (const [pixelColor, indexes] of Object.entries(pixels)) {
        for (const index of indexes) {
          pixelsArr[index] = pixelColor.toLowerCase()
        }
      }
      for (let i = 0; i < pixelsArr.length; i++) {
        if (!pixelsArr[i]) pixelsArr[i] = bg.toLowerCase()
      }
      return { id, pixels: pixelsArr }
    } catch (err) {
      console.error('Error when attempting to parse canvas from local storage!', err)
      return null
    }
  },

  toStorage: ({ id, pixels }: SavedCanvas): StorageCanvas => {
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
