import type { BucketPixel } from '@types'
import { PIXEL_ART_RES } from '@/consts'
import { colorComparison } from './colorComparison'

interface Params {
  startIndex: number
  pixelsMap: string[]
  zoneColor?: string
}

export const findPixelsNeighbours = ({ pixelsMap, startIndex, zoneColor }: Params) => {
  const bucketMap: BucketPixel[] = pixelsMap.map((pixelColor, index) => ({
    color: pixelColor,
    index,
    painted: false,
    generation: 0
  }))

  const getNeighbours = (bucketPixel: BucketPixel, gen: number) => {
    const { index, color: pixelColor, painted } = bucketPixel

    // If the color doesn't match or it was already painted, exit
    if ((zoneColor && !colorComparison(pixelColor, zoneColor)) || painted) {
      return
    }

    // Do paint
    bucketMap[index].painted = true
    bucketMap[index].generation = gen

    // Handle neighbours
    const rest = index % PIXEL_ART_RES

    const up = index - PIXEL_ART_RES >= 0 ? index - PIXEL_ART_RES : null
    const right = rest === PIXEL_ART_RES - 1 ? null : index + 1
    const down = index + PIXEL_ART_RES < PIXEL_ART_RES ** 2 ? index + PIXEL_ART_RES : null
    const left = rest === 0 ? null : index - 1

    for (const neighbour of [up, right, down, left]) {
      if (neighbour !== null) getNeighbours(bucketMap[neighbour], gen + 1)
    }
  }

  getNeighbours(bucketMap[startIndex], 1)
  const filteredSortedMap = bucketMap.filter(b => b.generation).sort((a, b) => a.generation - b.generation)
  return filteredSortedMap
}
