import type { BucketPixel } from '@types'
import { PIXEL_ART_RES } from '@/consts'
import { colorComparison } from './colorComparison'

interface Params {
  startIndexes: number[]
  pixelsMap: string[]
  zoneColor?: string
}

export const findBucketPixels = ({ pixelsMap, startIndexes, zoneColor }: Params) => {
  const bucketMap: BucketPixel[] = pixelsMap.map((pixelColor, index) => ({
    color: pixelColor,
    index,
    painted: false
  }))
  const powPixelRes = PIXEL_ART_RES ** 2

  const getNeighbours = (bucketPixel: BucketPixel) => {
    const { index: i } = bucketPixel
    const rest = i % PIXEL_ART_RES

    // Calculate neighbours indexes
    const up = i - PIXEL_ART_RES >= 0 ? i - PIXEL_ART_RES : -1
    const right = rest === PIXEL_ART_RES - 1 ? -1 : i + 1
    const down = i + PIXEL_ART_RES < powPixelRes ? i + PIXEL_ART_RES : -1
    const left = rest === 0 ? -1 : i - 1

    // Return filtered neighbours
    return [bucketMap[up], bucketMap[right], bucketMap[down], bucketMap[left]].filter(n => !!n)
  }

  const initialBucketPixels = startIndexes.map(i => {
    bucketMap[i].painted = true
    return { ...bucketMap[i], painted: true }
  })
  const groupedGenerations: BucketPixel[][] = [[...initialBucketPixels]]
  let currentGen = 0

  while (true) {
    const prevGen = currentGen
    currentGen++
    let didGenerateNeighbours = false

    // Calculate neighbours for each pixel of the previous generation
    for (const bucketPixel of groupedGenerations[prevGen]) {
      const neighbours = getNeighbours(bucketPixel)

      // Filter neighbours that match the zone color and haven't been painted yet
      const validatedNeighbours = neighbours.filter(n => {
        const isValid = (!zoneColor || colorComparison(n.color, zoneColor)) && !n.painted
        if (isValid) n.painted = true
        return isValid
      })

      // Push validated neigbours to the current generation group
      if (validatedNeighbours.length) {
        groupedGenerations[currentGen] ??= []
        groupedGenerations[currentGen].push(...validatedNeighbours)
        didGenerateNeighbours = true
      }
    }
    // Exit the loop when no new neighbours were generated
    if (!didGenerateNeighbours) break
  }
  return groupedGenerations
}
