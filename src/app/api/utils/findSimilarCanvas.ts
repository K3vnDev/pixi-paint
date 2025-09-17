import { canvasParser } from '@/utils/canvasParser'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { getAllCanvases } from './getAllCanvases'

export const findSimilarCanvas = async (pixels: string[]) => {
  const canvases = await getAllCanvases()

  for (const storageCanvas of canvases) {
    const collectionCanvas = canvasParser.fromStorage(storageCanvas)

    if (collectionCanvas && pixelsComparison(collectionCanvas.pixels, pixels)) {
      return collectionCanvas
    }
  }
  return null
}
