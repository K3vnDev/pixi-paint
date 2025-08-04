import type { GalleryCanvas, SavedCanvas } from '@types'
import { useEffect, useState } from 'react'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { useInterval } from './useInterval'

interface Params {
  canvases: SavedCanvas[]
  loaded: boolean
  cooldown?: number
}

export const useCanvasesGallery = ({ canvases, loaded, cooldown = 16 }: Params) => {
  const [canvasesGallery, setCanvasesGallery] = useState<GalleryCanvas[]>([])
  const { startInterval, stopInterval } = useInterval()

  useEffect(() => {
    if (!loaded || !canvases.length) {
      return
    }

    const newCanvasGallery: GalleryCanvas[] = []
    for (const { id, pixels } of canvases) {
      const dataUrl = getPixelsDataUrl(pixels)
      newCanvasGallery.push({ id, dataUrl, isVisible: false })
    }
    setCanvasesGallery(newCanvasGallery)

    let index = 0
    startInterval(() => {
      if (index >= canvases.length) {
        stopInterval()
        return
      }
      newCanvasGallery[index++].isVisible = true
      setCanvasesGallery([...newCanvasGallery])
    }, cooldown)

    return stopInterval
  }, [loaded])

  return { canvasesGallery }
}
