import { CANVAS_RESOLUTION } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { useInterval } from './useInterval'

export const useCanvasPixelsAppearing = (pixels: string[]) => {
  const { startInterval, stopInterval } = useInterval(null)
  const hasStarted = useRef(false)
  const [visiblePixelsMap, setVisiblePixelsMap] = useState<boolean[]>(
    Array(CANVAS_RESOLUTION ** 2).fill(false)
  )

  useEffect(() => {
    if (!hasStarted.current && pixels.length) {
      hasStarted.current = true
      const halfPixelArtRes = CANVAS_RESOLUTION / 2

      // Calculate start indexes
      const leftTopIndex = halfPixelArtRes - 1 + CANVAS_RESOLUTION * (halfPixelArtRes - 1)
      const rightTopIndex = leftTopIndex + 1
      const leftBottomIndex = leftTopIndex + CANVAS_RESOLUTION
      const rightBottomIndex = leftBottomIndex + 1

      // Calculate grouped generations
      const groupedGenerationsIndexes = findBucketPixels({
        pixelsMap: pixels,
        startIndexes: [leftTopIndex, rightTopIndex, leftBottomIndex, rightBottomIndex]
      }).map(g => g.map(p => p.index))

      let currentGenIndex = -1

      startInterval(() => {
        if (++currentGenIndex >= groupedGenerationsIndexes.length) {
          stopInterval()
          return
        }

        setVisiblePixelsMap(prev => {
          const newPixels = structuredClone(prev)
          for (const index of groupedGenerationsIndexes[currentGenIndex]) {
            newPixels[index] = true
          }
          return newPixels
        })
      }, 50)
    }
  }, [pixels])

  useEffect(
    () => () => {
      hasStarted.current = false
      setVisiblePixelsMap(Array(CANVAS_RESOLUTION ** 2).fill(false))
      stopInterval()
    },
    []
  )

  return { visiblePixelsMap }
}
