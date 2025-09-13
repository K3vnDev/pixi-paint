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

  // TODO: Check if there are canvas duplicates

  // Parse canvas
  const storageCanvas = canvasParser.toStorage({ id: 'no-id', pixels: validatedPixels })
  if (!storageCanvas) return response(false, 500, { msg: 'Error parsing canvas data' })

  // TODO: Check for id duplicates

  try {
    const newCanvas = new CanvasModel({
      ...storageCanvas,
      id: generateId()
    })
    await newCanvas.save()
    return response(true, 201)
  } catch {
    return response(false, 500)
  }
}
