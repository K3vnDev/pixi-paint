import type { BucketPixel } from '@/types'
import { useInterval } from './useInterval'

interface PaintBucketPixelsParams {
  groupedGens: BucketPixel[][]
  intervalTime: number
  paintGenAction: (generation: BucketPixel[]) => void
  instantPaintFirstGen?: boolean
}

export const usePaintBucketPixels = () => {
  const { startInterval, stopInterval } = useInterval()

  const paintBucketPixels = ({
    groupedGens,
    paintGenAction,
    instantPaintFirstGen = true,
    intervalTime
  }: PaintBucketPixelsParams) => {
    if (!groupedGens.length) return

    let currentGenIndex = -1
    if (instantPaintFirstGen) {
      paintGenAction(groupedGens[++currentGenIndex])
    }

    // Start the interval
    const intervalIndex = startInterval(() => {
      if (++currentGenIndex < groupedGens.length) {
        paintGenAction(groupedGens[currentGenIndex])
        return
      }
      stopInterval(intervalIndex)
    }, intervalTime)
  }

  return { paintBucketPixels }
}
