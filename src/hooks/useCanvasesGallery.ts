import type { GalleryCanvas, SavedCanvas } from '@types'
import { useEffect, useRef, useState } from 'react'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { useInterval } from './useInterval'
import { useTimeout } from './useTimeout'

interface Params {
  canvases: SavedCanvas[]
  loaded: boolean
  cooldown?: number
}

export const useCanvasesGallery = ({ canvases, loaded, cooldown = 16 }: Params) => {
  const [canvasesGallery, setCanvasesGallery] = useState<GalleryCanvas[]>([])
  const { startInterval, stopInterval } = useInterval()
  const { startTimeout, stopTimeout } = useTimeout([], () => {
    isAnimatingCanvases.current = false
  })
  const isAnimatingCanvases = useRef(true)

  const ANIM_TIMES = {
    SHOW: 25,
    HIDE: 250
  } as const

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
        isAnimatingCanvases.current = false
        return
      }
      newCanvasGallery[index++].isVisible = true
      setCanvasesGallery([...newCanvasGallery])
    }, cooldown)

    return stopInterval
  }, [loaded])

  const refreshCanvases = () => {
    if (
      !loaded ||
      !canvases.length ||
      canvases.length === canvasesGallery.length ||
      isAnimatingCanvases.current
    ) {
      return
    }

    try {
      const newCanvasesGallery = structuredClone(canvasesGallery)
      isAnimatingCanvases.current = true

      if (canvases.length > canvasesGallery.length) {
        // A new canvas was added
        const { canvas, index } = findExtraCanvas(canvases, canvasesGallery)
        const dataUrl = getPixelsDataUrl(canvas.pixels)
        newCanvasesGallery.splice(index, 0, { dataUrl, id: canvas.id, isVisible: false })
        setCanvasesGallery(newCanvasesGallery)

        startTimeout(() => {
          newCanvasesGallery[index].isVisible = true
          setCanvasesGallery([...newCanvasesGallery])
          stopTimeout()
        }, ANIM_TIMES.SHOW)
      } else {
        // A canvas was removed
        const { index } = findExtraCanvas(canvasesGallery, canvases)
        newCanvasesGallery[index].isVisible = false
        setCanvasesGallery(newCanvasesGallery)

        startTimeout(() => {
          newCanvasesGallery.splice(index, 1)
          setCanvasesGallery([...newCanvasesGallery])
          stopTimeout()
        }, ANIM_TIMES.HIDE)
      }
    } catch {
      isAnimatingCanvases.current = false
    }
  }

  useEffect(() => refreshCanvases(), [canvases])

  const findExtraCanvas = <T>(left: Array<{ id: string } & T>, right: Array<{ id: string }>) => {
    for (let i = 0; i < left.length; i++) {
      if (left[i]?.id !== right[i]?.id) return { canvas: left[i] as T, index: i }
    }
    throw new Error()
  }

  return { canvasesGallery }
}
