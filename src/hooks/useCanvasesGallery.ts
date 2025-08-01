import type { GalleryCanvas, SavedCanvas } from '@types'
import { useEffect, useRef, useState } from 'react'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'

interface Params {
  canvases: SavedCanvas[]
  loaded: boolean
  cooldown?: number
}

export const useCanvasesGallery = ({ canvases, loaded, cooldown = 20 }: Params) => {
  const [canvasesGallery, setCanvasesGallery] = useState<GalleryCanvas[]>([])
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!loaded || !canvases.length) {
      return stopInterval
    }

    setCanvasesGallery([])
    loadCanvas(0)
    let index = 1

    interval.current = setInterval(() => {
      if (index >= canvases.length) {
        stopInterval()
        return
      }
      loadCanvas(index++)
    }, cooldown)

    return stopInterval
  }, [loaded])

  const loadCanvas = (index: number) => {
    const { id, pixels } = canvases[index]
    const dataUrl = getPixelsDataUrl(pixels)
    setCanvasesGallery(c => [...c, { id, dataUrl }])
  }

  const stopInterval = () => {
    interval.current && clearInterval(interval.current)
    interval.current = null
  }

  return { canvasesGallery }
}
