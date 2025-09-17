import type { NextRequest } from 'next/server'
import { PixelsSchema } from '@/schemas/Pixels'
import { findSimilarCanvas } from '../../utils/findSimilarCanvas'
import { mongodb } from '../../utils/mongodb'
import { response } from '../../utils/response'

export const POST = async (req: NextRequest) => {
  await mongodb()
  let validatedPixels: string[]

  try {
    // Extract canvas from request
    const reqCanvas = await req.json()
    validatedPixels = await PixelsSchema.parseAsync(reqCanvas)
  } catch {
    return response(false, 400, { msg: 'Invalid canvas pixels data' })
  }

  try {
    // Look for a similar canvas and return its id if possible
    const similarCanvas = await findSimilarCanvas(validatedPixels)
    if (!similarCanvas) {
      return response(false, 404, { msg: 'Canvas not found' })
    }
    return response(true, 200, { data: similarCanvas.id })
  } catch {
    return response(false, 500)
  }
}
