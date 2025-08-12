import { BUCKET_INTERVAL_TIME, CANVAS_RESOLUTION } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { usePaintBucketPixels } from './usePaintBucketPixels'

export const useCanvasPixelsAppearing = (pixels: string[]) => {
  const hasStarted = useRef(false)
  const [visiblePixelsMap, setVisiblePixelsMap] = useState<boolean[]>(
    Array(CANVAS_RESOLUTION ** 2).fill(false)
  )
  const { paintBucketPixels } = usePaintBucketPixels()

  useEffect(() => {
    if (!hasStarted.current && pixels.length) {
      hasStarted.current = true

      // Calculate grouped generations
      const groupedGenerations = findBucketPixels({
        pixelsMap: pixels,
        startIndexes: calcMiddlePixelsIndexes()
      })

      paintBucketPixels({
        groupedGens: groupedGenerations,
        intervalTime: BUCKET_INTERVAL_TIME,
        instantPaintFirstGen: false,
        paintGenAction: generation => {
          setVisiblePixelsMap(prev => {
            const newPixels = structuredClone(prev)
            for (const bucketPixel of generation) {
              newPixels[bucketPixel.index] = true
            }
            return newPixels
          })
        }
      })
    }
  }, [pixels])

  useEffect(() => {
    return () => {
      hasStarted.current = false
      setVisiblePixelsMap(Array(CANVAS_RESOLUTION ** 2).fill(false))
    }
  }, [])

  return { visiblePixelsMap }
}
