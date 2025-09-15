import type { SavedCanvas, StorageCanvas } from '@types'
import type { NextRequest } from 'next/server'
import z from 'zod'
import { CanvasModel } from '@/models/Canvas'
import { SavedCanvasSchema } from '@/schemas/SavedCanvas'
import { canvasParser } from '@/utils/canvasParser'
import { mongodb } from '@/utils/mongodb'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { response } from '@/utils/response'

export const POST = async (req: NextRequest) => {
  await mongodb()
  let clientCanvases: SavedCanvas[]
  const dbCanvases: SavedCanvas[] = []

  console.log('Check request!')

  try {
    // Extract canvases from client
    const data = await req.json()
    clientCanvases = z.array(SavedCanvasSchema).parse(data)
  } catch {
    return response(false, 400, { msg: 'Invalid saved canvases data' })
  }

  try {
    // Extract canvases from database
    const rawDBCanvases: StorageCanvas[] = await CanvasModel.find({})

    for (const { id, bg, pixels: rawPixels } of rawDBCanvases) {
      const pixels = Object.fromEntries(rawPixels as any)
      const parsed = canvasParser.fromStorage({ id, bg, pixels })
      parsed && dbCanvases.push(parsed)
    }
  } catch {
    return response(false, 500)
  }

  const userPublishedIds: string[] = []

  /*
    For each client canvas, check if a similar one exist on the server.
    If so, add client id to ids array and exit db canvases loop.
  */
  for (const clientCanvas of clientCanvases) {
    for (const dbCanvas of dbCanvases) {
      if (pixelsComparison(clientCanvas.pixels, dbCanvas.pixels)) {
        userPublishedIds.push(clientCanvas.id)
        break
      }
    }
  }

  return response(true, 200, { data: userPublishedIds })
}
