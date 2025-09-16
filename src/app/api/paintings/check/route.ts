import type { SavedCanvas } from '@types'
import type { NextRequest } from 'next/server'
import z from 'zod'
import { mongodb } from '@/app/api/utils/mongodb'
import { response } from '@/app/api/utils/response'
import { SavedCanvasSchema } from '@/schemas/SavedCanvas'
import { canvasParser } from '@/utils/canvasParser'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { getAllCanvases } from '../../utils/getAllCanvases'

export const POST = async (req: NextRequest) => {
  await mongodb()
  let clientCanvases: SavedCanvas[]
  let dbCanvases: SavedCanvas[]

  try {
    // Extract canvases from client
    const data = await req.json()
    clientCanvases = z.array(SavedCanvasSchema).parse(data)
  } catch {
    return response(false, 400, { msg: 'Invalid saved canvases data' })
  }

  try {
    // Extract canvases from database
    const rawDBCanvases = await getAllCanvases()
    dbCanvases = canvasParser.batch.fromStorage(rawDBCanvases)
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
