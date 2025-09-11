import type { GalleryCanvas, SavedCanvas } from '@types'
import { useEffect, useRef, useState } from 'react'
import { CANVASES_TRANSITION_MS } from '@/consts'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { getSafeWinDoc } from '@/utils/getSafeWinDoc'
import { useDebounce } from './useDebounce'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'
import { useInterval } from './useInterval'
import { useTimeout } from './useTimeout'

interface Params {
  stateCanvases: SavedCanvas[]
  loaded: boolean
  appearCooldown?: number
}

export const useCanvasesGallery = ({ stateCanvases, loaded, appearCooldown = 20 }: Params) => {
  const [canvasesGallery, setCanvasesGallery] = useState<GalleryCanvas[]>([])
  const { startInterval, stopInterval } = useInterval()
  const { startTimeout, stopTimeout } = useTimeout([], () => {
    isAnimatingCanvases.current = false
  })
  const isAnimatingCanvases = useRef(true)
  const refs = useFreshRefs({ stateCanvases, canvasesGallery })

  const debouncedStateCanvases = useDebounce(stateCanvases, 200)
  const isFirstCanvasRefresh = useRef(true)

  const animateCanvasesAppear = (initialCanvasGallery: GalleryCanvas[]) => {
    setCanvasesGallery(initialCanvasGallery)
    const newCanvasGallery = [...initialCanvasGallery]
    stopInterval()
    let index = -1
    isAnimatingCanvases.current = true

    startInterval(() => {
      while (true) {
        index++

        // Stop interval when index is out of range
        if (index >= stateCanvases.length) {
          stopInterval()
          isAnimatingCanvases.current = false
          return
        }

        // Break when a not visible canvas was found
        if (!newCanvasGallery[index].isVisible) {
          break
        }
      }
      newCanvasGallery[index].isVisible = true
      setCanvasesGallery([...newCanvasGallery])
    }, appearCooldown)
  }

  // Cancel loading animations on scroll
  useEvent(
    'scroll',
    () => {
      const { canvasesGallery } = refs.current
      if (isAnimatingCanvases.current && loaded && canvasesGallery.length) {
        // Stop interval and set all canvases as visible
        stopInterval()

        const newCanvasesGallery = structuredClone(canvasesGallery)
        canvasesGallery.forEach((_, i) => {
          newCanvasesGallery[i].isVisible = true
        })
        setCanvasesGallery(newCanvasesGallery)
      }
    },
    { target: getSafeWinDoc().window }
  )

  // Handle initial canvases appear animation
  useEffect(() => {
    const { stateCanvases } = refs.current
    if (!loaded || !stateCanvases.length) {
      return
    }

    // Create initial canvas gallery with all elements invisible
    const initialCanvasGallery: GalleryCanvas[] = stateCanvases.map(({ id, pixels }) => {
      const dataUrl = getPixelsDataUrl(pixels)
      return { id, dataUrl, isVisible: false }
    })

    // Animate canvases
    animateCanvasesAppear(initialCanvasGallery)
    return stopInterval
  }, [loaded])

  const refreshCanvases = () => {
    const { canvasesGallery, stateCanvases } = refs.current

    requestAnimationFrame(() => {
      if (stateCanvases.length > canvasesGallery.length) {
        // > New canvases were added <
        const prevCanvasesGalleryMap = createRecordFrom(canvasesGallery)

        // Create new canvases gallery, recycling previous ones
        const newCanvasesGallery: GalleryCanvas[] = stateCanvases.map(({ id, pixels }) => {
          const existingCanvas = prevCanvasesGalleryMap[id]
          if (existingCanvas) return existingCanvas

          const dataUrl = getPixelsDataUrl(pixels)
          return { dataUrl, id, isVisible: false }
        })
        // Animate canvases
        animateCanvasesAppear(newCanvasesGallery)
      } else if (stateCanvases.length < canvasesGallery.length) {
        // > Some canvases were deleted <
        const prevStateCanvasesMap = createRecordFrom(stateCanvases)

        // Identify what canvases were deleted and hide them
        const newCanvasesGallery: GalleryCanvas[] = canvasesGallery.map(({ id, dataUrl }) => {
          const canvasWasDeleted = !prevStateCanvasesMap[id]
          return { id, dataUrl, isVisible: !canvasWasDeleted }
        })
        setCanvasesGallery(newCanvasesGallery)

        // Remove deleted canvases after a delay
        startTimeout(() => {
          const filteredCanvasesGallery = newCanvasesGallery.filter(c => c.isVisible)
          setCanvasesGallery([...filteredCanvasesGallery])
          stopTimeout()
        }, CANVASES_TRANSITION_MS)
      } else {
        // > Some canvases might've been replaced <
        const prevCanvasesGalleryMap = createRecordFrom(canvasesGallery)
        let changesWereMade = false

        const newCanvasesGallery: GalleryCanvas[] = stateCanvases.map(({ id, pixels }) => {
          const { dataUrl: prevDataUrl } = prevCanvasesGalleryMap[id]
          if (!prevDataUrl) {
            changesWereMade = true
          }
          const dataUrl = prevDataUrl ?? getPixelsDataUrl(pixels)
          return { dataUrl, id, isVisible: true }
        })

        changesWereMade && setCanvasesGallery(newCanvasesGallery)
      }
    })
  }

  // Animate canvases when stateCanvases changes (but not on first render)
  useEffect(() => {
    if (isFirstCanvasRefresh.current) {
      isFirstCanvasRefresh.current = false
      return
    }
    refreshCanvases()
  }, [debouncedStateCanvases])

  const createRecordFrom = <T>(arr: Array<{ id: string } & T>) => {
    const record: Record<string, T> = {}
    arr.forEach(item => {
      record[item.id] = item
    })
    return record
  }

  return {
    canvasesGallery,
    isAnimatingCanvases: isAnimatingCanvases.current,
    refreshCanvases
  }
}
