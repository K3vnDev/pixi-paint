import type { StorageCanvas } from '@types'
import { CanvasModel } from '@/models/Canvas'

export const getAllCanvases = async (): Promise<StorageCanvas[]> => {
  const rawDBCanvases: StorageCanvas[] = await CanvasModel.find({})
  return rawDBCanvases.map(({ id, bg, pixels }) => ({ id, bg, pixels: Object.fromEntries(pixels as any) }))
}
