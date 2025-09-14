import type { NextRequest } from 'next/server'
import { CanvasModel } from '@/models/Canvas'
import { PixelsSchema } from '@/schemas/Pixels'
import { canvasParser } from '@/utils/canvasParser'
import { generateId } from '@/utils/generateId'
import { mongodb } from '@/utils/mongodb'
import { response } from '@/utils/response'

export const GET = async () => {
  await mongodb()

  try {
    const canvases = await CanvasModel.find({})
    const data = canvases.map(({ id, bg, pixels }) => ({ id, bg, pixels }))
    return response(true, 200, { data })
  } catch {
    return response(false, 500)
  }
}

export const POST = async (req: NextRequest) => {
  await mongodb()
  let validatedPixels: string[]

  try {
    // Extract canvas from request
    const reqCanvas = await req.json()
    validatedPixels = await PixelsSchema.parseAsync(reqCanvas)
  } catch {
    return response(false, 400, { msg: 'Invalid canvas data' })
  }

  // TODO: Check if a similar canvas is already published
  /////////////////////////////////////////////

  // Parse canvas
  const storageCanvas = canvasParser.toStorage({ id: 'no-id', pixels: validatedPixels })
  if (!storageCanvas) return response(false, 500, { msg: 'Error parsing canvas data' })

  let attemptsCount = 0
  const MAX_ATTEMPTS = 7

  // Save canvas with generated id until its unique
  while (attemptsCount++ < MAX_ATTEMPTS) {
    try {
      const id = generateId()
      const newCanvas = new CanvasModel({ ...storageCanvas, id })
      await newCanvas.save()

      return response(true, 201, { data: id })
    } catch (err: any) {
      if (err?.code !== 11000) break
    }
  }
  return response(false, 500)
}
