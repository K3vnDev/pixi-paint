import { CANVAS_RESOLUTION } from '@consts'

export const getPixelsDataUrl = (pixels: string[]) => {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_RESOLUTION
  canvas.height = CANVAS_RESOLUTION
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // Draw each pixel
  pixels.forEach((pixelColor, i) => {
    const x = i % CANVAS_RESOLUTION
    const y = Math.floor(i / CANVAS_RESOLUTION)
    ctx.fillStyle = pixelColor
    ctx.fillRect(x, y, 1, 1)
  })

  ctx.imageSmoothingEnabled = false
  return canvas.toDataURL()
}
