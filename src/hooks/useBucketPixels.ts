import { BUCKET_INTERVAL_TIME, CANVAS_RESOLUTION } from '@consts'
import type { BucketPixel } from '@types'
import { useRef } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'
import { generateId } from '@/utils/generateId'
import { useFreshRefs } from './useFreshRefs'
import { useInterval } from './useInterval'

interface PaintBucketPixelsParams {
  intervalTime?: number
  autoIntervalTime?: boolean
  paintGenerationAction: (generation: BucketPixel[]) => void
  startIndexes: number[]
  zoneColor?: string
}

interface CalcGenerationParams {
  zoneColor?: string
  last: BucketPixel[]
  bucketMapId: string
}

export const useBucketPixels = () => {
  const { startInterval, stopInterval } = useInterval()
  const pixelsMap = usePaintStore(s => s.pixels)
  const pixelsMapRef = useFreshRefs(pixelsMap)

  const bucketMaps = useRef(new Map<string, BucketPixel[]>())

  const createNewBucketMap = () => {
    const id = generateId(id => !bucketMaps.current.has(id))
    const bucketMap = pixelsMapRef.current.map((color, index) => ({ color, index, painted: false }))
    bucketMaps.current.set(id, bucketMap)

    return { id, bucketMap }
  }

  const getBucketMap = (id: string) => {
    const bucketMap = bucketMaps.current.get(id)
    if (!bucketMap) throw new Error(`Bucket map with id ${id} not found!`)
    return bucketMap
  }

  const deleteBucketMap = (id: string) => bucketMaps.current.delete(id)

  const refreshBucketMap = (id: string) => {
    const bucketMap = getBucketMap(id)
    if (!bucketMap) return

    for (let i = 0; i < bucketMap.length; i++) {
      bucketMap[i].color = pixelsMapRef.current[i]
    }
  }

  const resetBucketMap = (id: string) => {
    const bucketMap = getBucketMap(id)
    if (!bucketMap) return

    for (const bucketPixel of bucketMap) {
      bucketPixel.painted = false
    }
  }

  const paintBucketPixels = ({
    paintGenerationAction,
    intervalTime = BUCKET_INTERVAL_TIME,
    autoIntervalTime = false,
    startIndexes,
    zoneColor
  }: PaintBucketPixelsParams) => {
    const { id: bucketMapId, bucketMap } = createNewBucketMap()

    const initialBucketPixels = startIndexes.map(i => {
      bucketMap[i].painted = true
      return { ...bucketMap[i], painted: true }
    })

    let newIntervalTime = intervalTime

    if (autoIntervalTime) {
      const { generationsCount } = calcGenerationsInstantly({
        last: initialBucketPixels,
        zoneColor,
        bucketMapId
      })
      newIntervalTime = calcIntervalTime(generationsCount)
    }

    if (newIntervalTime > 0) {
      // Paint generations over an interval
      let lastGeneration = initialBucketPixels
      paintGenerationAction(lastGeneration)

      const MAX_ITERATIONS = 40
      let iterationCount = 0

      const intervalIndex = startInterval(() => {
        refreshBucketMap(bucketMapId)

        const nextGeneration = calcNextGeneration({ last: lastGeneration, zoneColor, bucketMapId })

        // Stop if there isn't a next generation or limit was reached
        if (!nextGeneration || iterationCount > MAX_ITERATIONS) {
          stopInterval(intervalIndex)
          deleteBucketMap(bucketMapId)
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
    const { instantGeneration } = calcGenerationsInstantly({
      last: initialBucketPixels,
      bucketMapId,
      zoneColor
    })
    paintGenerationAction(instantGeneration)
    deleteBucketMap(bucketMapId)
    return
  }

  const getNeighbours = (bucketPixel: BucketPixel, bucketMapId: string) => {
    const { index: i } = bucketPixel
    const rest = i % CANVAS_RESOLUTION
    const powPixelRes = CANVAS_RESOLUTION ** 2
    const bucketMap = getBucketMap(bucketMapId)

    // Calculate neighbours indexes
    const up = i - CANVAS_RESOLUTION >= 0 ? i - CANVAS_RESOLUTION : -1
    const right = rest === CANVAS_RESOLUTION - 1 ? -1 : i + 1
    const down = i + CANVAS_RESOLUTION < powPixelRes ? i + CANVAS_RESOLUTION : -1
    const left = rest === 0 ? -1 : i - 1

    // Return filtered neighbours
    return [bucketMap[up], bucketMap[right], bucketMap[down], bucketMap[left]].filter(n => !!n)
  }

  const calcGenerationsInstantly = ({ bucketMapId, last, zoneColor }: CalcGenerationParams) => {
    let lastGeneration = last
    const instantGeneration: BucketPixel[] = [...lastGeneration]
    let generationsCount = 1

    while (true) {
      const nextGeneration = calcNextGeneration({ bucketMapId, last: lastGeneration, zoneColor })
      if (!nextGeneration) break

      instantGeneration.push(...nextGeneration)
      lastGeneration = nextGeneration
      generationsCount++
    }

    resetBucketMap(bucketMapId)
    return { instantGeneration, generationsCount }
  }

  const calcNextGeneration = ({ bucketMapId, last, zoneColor }: CalcGenerationParams) => {
    const generation: BucketPixel[] = []

    // Calculate neighbours for each pixel of the previous generation
    for (const bucketPixel of last) {
      const neighbours = getNeighbours(bucketPixel, bucketMapId)

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
