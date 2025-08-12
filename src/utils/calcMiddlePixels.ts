import { CANVAS_RESOLUTION } from '@/consts'

export const calcMiddlePixelsIndexes = () => {
  const halfPixelArtRes = CANVAS_RESOLUTION / 2

  // Calculate start indexes
  const leftTopIndex = halfPixelArtRes - 1 + CANVAS_RESOLUTION * (halfPixelArtRes - 1)
  const rightTopIndex = leftTopIndex + 1
  const leftBottomIndex = leftTopIndex + CANVAS_RESOLUTION
  const rightBottomIndex = leftBottomIndex + 1

  return [leftTopIndex, rightTopIndex, leftBottomIndex, rightBottomIndex]
}
