import { PIXEL_ART_RES } from '@consts'

export const getPixelsDataUrl = (pixels: string[]) => {
  const canvas = document.createElement('canvas')
  canvas.width = PIXEL_ART_RES
  canvas.height = PIXEL_ART_RES
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // Draw each pixel
  pixels.forEach((pixelColor, i) => {
    const x = i % PIXEL_ART_RES
    const y = Math.floor(i / PIXEL_ART_RES)
    ctx.fillStyle = pixelColor
    ctx.fillRect(x, y, 1, 1)
  })

  ctx.imageSmoothingEnabled = false
  return canvas.toDataURL()
}
