import { CANVAS_PIXELS_LENGHT } from '@consts'
import z from 'zod'

const pixelsMaxValue = CANVAS_PIXELS_LENGHT - 1

export const JSONCanvasSchema = z.object({
  pixels: z.record(z.string(), z.array(z.number().min(0).max(pixelsMaxValue))),
  bg: z.string()
})
