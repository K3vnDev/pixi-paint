import type { NextRequest } from 'next/server'
import { mongodb } from '@/app/api/utils/mongodb'
import { response } from '@/app/api/utils/response'
import { CanvasModel } from '@/models/Canvas'
import { PixelsSchema } from '@/schemas/Pixels'
import { canvasParser } from '@/utils/canvasParser'
import { generateId } from '@/utils/generateId'
import { findSimilarCanvas } from '../utils/findSimilarCanvas'
import { getAllCanvases } from '../utils/getAllCanvases'

export const GET = async () => {
  await mongodb()

  try {
    const canvases = await getAllCanvases()
    return response(true, 200, { data: canvases })
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
    return response(false, 400, { msg: 'Invalid canvas pixels data' })
  }

  // Check if a similar canvas is already published
  if (await findSimilarCanvas(validatedPixels)) {
    return response(false, 409, { msg: 'Canvas was already published' })
  }

  // Parse canvas
  const storageCanvas = canvasParser.toStorage(validatedPixels)
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
