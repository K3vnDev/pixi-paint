import { BUCKET_INTERVAL_TIME, CANVAS_RESOLUTION } from '@consts'
import type { BucketPixel } from '@types'
import { useEffect, useRef } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'
import { useFreshRefs } from './useFreshRefs'
import { useInterval } from './useInterval'

interface PaintBucketPixelsParams {
  intervalTime?: number
  autoIntervalTime?: boolean
  paintGenerationAction: (generation: BucketPixel[]) => void
  startIndexes: number[]
  zoneColor?: string
}

export const useBucketPixels = () => {
  const { startInterval, stopInterval } = useInterval()
  const pixelsMap = usePaintStore(s => s.pixels)
  const pixelsMapRef = useFreshRefs(pixelsMap)

  // Generate initial bucket map
  const bucketMap = useRef<BucketPixel[]>([])
  useEffect(() => {
    if (!pixelsMap.length) return

    bucketMap.current = pixelsMap.map((pixelColor, index) => ({
      color: pixelColor,
      index,
      painted: false
    }))
  }, [pixelsMap])

  const refreshBucketMapColors = () => {
    for (let i = 0; i < bucketMap.current.length; i++) {
      bucketMap.current[i].color = pixelsMapRef.current[i]
    }
  }

  const paintBucketPixels = ({
    paintGenerationAction,
    intervalTime = BUCKET_INTERVAL_TIME,
    autoIntervalTime = false,
    startIndexes,
    zoneColor
  }: PaintBucketPixelsParams) => {
    const initialBucketPixels = startIndexes.map(i => {
      bucketMap.current[i].painted = true
      return { ...bucketMap.current[i], painted: true }
    })

    let lastGeneration = initialBucketPixels
    let newIntervalTime = intervalTime

    if (autoIntervalTime) {
      const { generationsCount } = calcGenerationsInstantly(initialBucketPixels, zoneColor)
      newIntervalTime = calcIntervalTime(generationsCount)
    }

    if (newIntervalTime > 0) {
      // Paint generations over an interval
      paintGenerationAction(initialBucketPixels)
      const MAX_ITERATIONS = 40
      let iterationCount = 0

      const intervalIndex = startInterval(() => {
        refreshBucketMapColors()
        const nextGeneration = calcNextGeneration(lastGeneration, zoneColor)

        // Stop if there isn't a next generation or limit was reached
        if (!nextGeneration || iterationCount > MAX_ITERATIONS) {
          stopInterval(intervalIndex)
          return
        }

        // Paint generation and increase count
        paintGenerationAction(nextGeneration)
        lastGeneration = nextGeneration
        iterationCount++
      }, newIntervalTime)
      return
    }

    // Paint generations instantly
    const { instantGeneration } = calcGenerationsInstantly(initialBucketPixels, zoneColor)
    paintGenerationAction(instantGeneration)
    return
  }

  const getNeighbours = (bucketPixel: BucketPixel) => {
    const { index: i } = bucketPixel
    const rest = i % CANVAS_RESOLUTION
    const powPixelRes = CANVAS_RESOLUTION ** 2

    // Calculate neighbours indexes
    const up = i - CANVAS_RESOLUTION >= 0 ? i - CANVAS_RESOLUTION : -1
    const right = rest === CANVAS_RESOLUTION - 1 ? -1 : i + 1
    const down = i + CANVAS_RESOLUTION < powPixelRes ? i + CANVAS_RESOLUTION : -1
    const left = rest === 0 ? -1 : i - 1

    // Return filtered neighbours
    return [
      bucketMap.current[up],
      bucketMap.current[right],
      bucketMap.current[down],
      bucketMap.current[left]
    ].filter(n => !!n)
  }

  const calcGenerationsInstantly = (firstGen: BucketPixel[], zoneColor?: string) => {
    let lastGeneration = firstGen
    const instantGeneration: BucketPixel[] = [...lastGeneration]
    let generationsCount = 1

    while (true) {
      const nextGeneration = calcNextGeneration(lastGeneration, zoneColor)
      if (!nextGeneration) break

      instantGeneration.push(...nextGeneration)
      lastGeneration = nextGeneration
      generationsCount++
    }

    return { instantGeneration, generationsCount }
  }

  const calcNextGeneration = (lastGeneration: BucketPixel[], zoneColor?: string) => {
    const generation: BucketPixel[] = []

    // Calculate neighbours for each pixel of the previous generation
    for (const bucketPixel of lastGeneration) {
      const neighbours = getNeighbours(bucketPixel)

      // Filter neighbours that match the zone color and haven't been painted yet
      const validatedNeighbours = neighbours.filter(n => {
        const isValid = (!zoneColor || colorComparison(n.color, zoneColor)) && !n.painted
        if (isValid) n.painted = true
        return isValid
      })

      // Push validated neigbours to the current generation group
      if (validatedNeighbours.length) {
        generation.push(...validatedNeighbours)
      }
    }

    // Return null if generation is empty
    return generation.length ? generation : null
  }

  const calcIntervalTime = (count: number) => {
    const relativeMax = 33
    const t = { min: 25, max: 70 }
    const calculated = t.min + (1 - count / relativeMax) * t.max - t.min

    return Math.max(calculated, t.min)
  }

  return { paintBucketPixels }
}
