import { CANVAS_RESOLUTION } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { useBucketPixels } from './useBucketPixels'

export const useCanvasPixelsAppearing = (pixels: string[]) => {
  const hasStarted = useRef(false)

  const [visiblePixelsMap, setVisiblePixelsMap] = useState<boolean[]>(
    Array(CANVAS_RESOLUTION ** 2).fill(false)
  )
  const { paintBucketPixels } = useBucketPixels()

  useEffect(() => {
    if (!hasStarted.current && pixels.length) {
      hasStarted.current = true

      paintBucketPixels({
        startIndexes: calcMiddlePixelsIndexes(),
        paintGenerationAction: generation => {
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
