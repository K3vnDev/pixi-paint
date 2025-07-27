import type { TOOLS } from '@consts'

export interface Pixel {
  color: string
}

export interface ToolbarItem {
  name: string
  tool: TOOLS
  shortcut: string
}

export interface SavedCanvas {
  id: string
  pixels: Pixel[]
}
