import type { TOOLS } from '@consts'

export interface BucketPixel {
  index: number
  color: string
  painted: boolean
}

export interface ToolbarItem {
  name: string
  tool: TOOLS
  shortcut: string
}

export interface SavedCanvas {
  id: string
  pixels: string[]
}
