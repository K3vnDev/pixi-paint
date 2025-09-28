import type { GalleryCanvas, SavedCanvas } from '@types'
import { useEffect, useRef, useState } from 'react'
import { CANVASES_TRANSITION_MS } from '@/consts'
import { createIdRecordFrom } from '@/utils/createIdRecordFrom'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { useInterval } from './timer-handlers/useInterval'
import { useTimeout } from './timer-handlers/useTimeout'
import { useDebounce } from './useDebounce'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'

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
    { target: 'window' }
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
      return { id, dataUrl, pixels, isVisible: false }
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
        const prevCanvasesGalleryMap = createIdRecordFrom(canvasesGallery)

        // Create new canvases gallery, recycling previous ones
        const newCanvasesGallery: GalleryCanvas[] = stateCanvases.map(({ id, pixels }) => {
          const existingCanvas = prevCanvasesGalleryMap[id]
          if (existingCanvas) return existingCanvas

          const dataUrl = getPixelsDataUrl(pixels)
          return { dataUrl, id, pixels, isVisible: false }
        })
        // Animate canvases
        animateCanvasesAppear(newCanvasesGallery)
      } else if (stateCanvases.length < canvasesGallery.length) {
        // > Some canvases were deleted <
        const prevStateCanvasesMap = createIdRecordFrom(stateCanvases)

        // Identify what canvases were deleted and hide them
        const newCanvasesGallery: GalleryCanvas[] = canvasesGallery.map(c => {
          const canvasWasDeleted = !prevStateCanvasesMap[c.id]
          return { ...c, isVisible: !canvasWasDeleted }
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
        const prevCanvasesGalleryMap = createIdRecordFrom(canvasesGallery)
        let changesWereMade = false

        const newCanvasesGallery: GalleryCanvas[] = stateCanvases.map(c => {
          const { dataUrl: prevDataUrl } = prevCanvasesGalleryMap[c.id]
          if (!prevDataUrl) {
            changesWereMade = true
          }
          const dataUrl = prevDataUrl ?? getPixelsDataUrl(c.pixels)
          return { ...c, dataUrl, isVisible: true }
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

  return {
    canvasesGallery,
    isAnimatingCanvases: isAnimatingCanvases.current,
    refreshCanvases
  }
}
