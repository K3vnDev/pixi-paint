import { CANVAS_PIXELS_LENGHT } from '@consts'
import z from 'zod'

export const PixelsSchema = z
  .array(
    z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
      .toLowerCase()
  )
  .length(CANVAS_PIXELS_LENGHT)
