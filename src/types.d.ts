import type { EVENTS, ICON_NAMES, TOOLS } from '@consts'

export type CustomEventName = (typeof EVENTS)[keyof typeof EVENTS]

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
  pixels: string[]
  isVisible: boolean
}

export interface Cursor {
  imageName: string
  origin: Origin
  colorize?: 'primary' | 'secondary'
}

export interface JSONCanvas {
  pixels: Record<string, number[]>
  bg: string
}

export interface StorageCanvas extends JSONCanvas {
  id: string
}

export interface PaintPixelData {
  index: number
  color: string
}

export type ReusableComponent = {
  className?: string
  style?: React.CSSProperties
  ref?: React.RefObject<any>
}

export type IconName = (typeof ICON_NAMES)[number]

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

export type ContextMenuDetail = {
  position: Origin
  options: ContextMenuOption[]
  allowedClicks: CLICK_BUTTON[]
}

export interface Option {
  label: string
  icon?: IconName
}

export interface ContextMenuOption extends Option {
  action: () => void
}

export interface DownloadSettings {
  formatIndex: number
  sizeIndex: number
}

export interface TooltipDetail {
  text: string
  position?: Origin
}

export interface DialogMenuDetail {
  component: React.ReactNode
  id: string
}

export interface Route {
  name: string
  icon: IconName
}

export interface StoredSelectedColors {
  primaryColor: string
  secondaryColor: string
}
