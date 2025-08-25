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
  imageName: string
  origin: {
    x: number
    y: number
  }
  colorize?: 'primary' | 'secondary'
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

export type ReusableComponent = {
  className?: string
  style?: React.CSSProperties
  ref?: React.RefObject<any | null>
}

export interface Origin {
  x: number
  y: number
}

export interface Position {
  left?: string
  right?: string
  top?: string
  bottom?: string
}

export type ContextMenuBuilder = {
  position: Origin
  options: ContextMenuOption[]
  allowedClicks: CLICK_BUTTON[]
}

export type IconName =
  | 'check'
  | 'clone'
  | 'cross'
  | 'download'
  | 'pencil'
  | 'trash'
  | 'arrows-corner'
  | 'warning'

export interface ContextMenuOption {
  label: string
  icon: IconName
  action: () => void
}

export type TransformOrigin =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
