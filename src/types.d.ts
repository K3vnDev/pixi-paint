import type { MODES } from '@consts'

export interface Pixel {
  color: string
}

export interface ToolbarItem {
  name: string
  mode: MODES
}

export interface SavedCanvas {
  id: string
  pixels: Pixel[]
}
