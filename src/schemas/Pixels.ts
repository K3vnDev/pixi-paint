import { CANVAS_PIXELS_LENGHT } from '@consts'
import z from 'zod'
import { validateColor } from '@/utils/validateColor'

export const PixelsSchema = z
  .array(
    z
      .string()
      .toLowerCase()
      .transform(c => {
        const { isValid, value } = validateColor(c)
        if (!isValid) throw new Error(`Invalid hex color! Recieved: ${c}`)
        return value
      })
  )
  .length(CANVAS_PIXELS_LENGHT)
