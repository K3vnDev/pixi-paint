import type { TOOLS } from '@consts'

export interface BucketPixel {
  index: number
  color: string
  painted: boolean
}

export interface ToolbarTool {
  name: string
  imageSrc: string
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
