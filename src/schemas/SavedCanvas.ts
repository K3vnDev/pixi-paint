import z from 'zod'
import { PixelsSchema } from './Pixels'

export const SavedCanvasSchema = z.object({
  id: z.string(),
  pixels: PixelsSchema
})
