import type { TOOLS } from '@consts'

export interface BucketPixel {
  index: number
  color: string
  painted: boolean
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
  isVisible: boolean
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

export interface PaintPixelData {
  index: number
  color: string
}

export interface ReusableComponent {
  className?: string
  style?: React.CSSProperties
}

export type ContextMenuBuilder = {
  position: { x: number; y: number }
  options: ContextMenuOption[]
}

export interface ContextMenuOption {
  label: string
  icon: 'check' | 'clone' | 'cross' | 'download' | 'pencil' | 'trash'
  action: () => void
}
