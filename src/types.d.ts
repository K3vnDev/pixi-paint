import type { TOOLS } from '@consts'

export interface BucketPixel {
  index: number
  color: string
  painted: boolean
  generation: number
}

export interface ToolbarTool {
  cursor: Cursor
  tool: TOOLS
  shortcut: string
  onSelect?: () => void
}

export interface SavedCanvas {
  id: string
  pixels: string[]
}

export interface GalleryCanvas {
  id: string
  dataUrl: string
}

export interface Cursor {
  name: string
  imageUrl: string
  position: {
    x: number
    y: number
  }
  colorImageUrl?: string
}

export interface StorageCanvas {
  id: string
  pixels: {
    pixels: Record<string, number[]>
    bg: string
  }
}
