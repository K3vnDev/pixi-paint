import { PIXEL_ART_RES } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { useInterval } from './useInterval'

export const useCanvasPixelsAppearing = (pixels: string[]) => {
  const { startInterval, stopInterval } = useInterval(null)
  const hasStarted = useRef(false)
  const [visiblePixelsMap, setVisiblePixelsMap] = useState<boolean[]>(Array(PIXEL_ART_RES ** 2).fill(false))

  useEffect(() => {
    if (!hasStarted.current && pixels.length) {
      hasStarted.current = true
      const halfPixelArtRes = PIXEL_ART_RES / 2

      // Calculate start indexes
      const leftTopIndex = halfPixelArtRes - 1 + PIXEL_ART_RES * (halfPixelArtRes - 1)
      const rightTopIndex = leftTopIndex + 1
      const leftBottomIndex = leftTopIndex + PIXEL_ART_RES
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
      setVisiblePixelsMap(Array(PIXEL_ART_RES ** 2).fill(false))
      stopInterval()
    },
    []
  )

  return { visiblePixelsMap }
}
