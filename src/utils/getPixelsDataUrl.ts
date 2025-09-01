import { CANVAS_RESOLUTION } from '@consts'

interface Config {
  type?: string
  scale?: number
}

export const getPixelsDataUrl = (pixels: string[], config?: Config) => {
  const type = config?.type
  const scale = config?.scale ?? 1

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_RESOLUTION * scale
  canvas.height = CANVAS_RESOLUTION * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // Draw each pixel
  pixels.forEach((pixelColor, i) => {
    const x = i % CANVAS_RESOLUTION
    const y = Math.floor(i / CANVAS_RESOLUTION)
    ctx.fillStyle = pixelColor
    ctx.fillRect(x * scale, y * scale, scale, scale)
  })

  ctx.imageSmoothingEnabled = false
  return canvas.toDataURL(type)
}
