import { CANVAS_RESOLUTION } from '@consts'
import z from 'zod'

const pixelsMaxValue = CANVAS_RESOLUTION ** 2 - 1

export const JSONCanvas = z.object({
  pixels: z.record(z.string(), z.array(z.number().min(0).max(pixelsMaxValue))),
  bg: z.string()
})
