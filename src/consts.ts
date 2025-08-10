import type { Cursor, SavedCanvas } from '@types'

export enum TOOLS {
  NONE,
  BRUSH,
  BUCKET,
  ERASER,
  COLOR_PICKER
}

export const CANVAS_RESOLUTION = 8

export const INITIAL_BG = '#FFF'

export const WHEEL_SWITCH_TOOL_COOLDOWN = 110

// Store
export const BLANK_PIXELS = Array.from({ length: CANVAS_RESOLUTION ** 2 }, () => INITIAL_BG)
export const BLANK_DRAFT: SavedCanvas = { id: 'draft', pixels: BLANK_PIXELS }

// LocalStorage keys
export const LS_DRAFT_CANVAS_KEY = 'draft-canvas'
export const LS_SAVED_CANVASES_KEY = 'saved-canvases'
export const LS_EDITING_CANVAS_ID_KEY = 'editing-canvas-id'

// Colors
export const COLOR_PALETTE = {
  RED: '#e14434',
  ORANGE: '#ff7a30',
  BROWN: '#735951',
  YELLOW: '#fae337',
  LIGHT_GREEN: '#7ad63a',
  DARK_GREEN: '#187a23',
  LIGHT_BLUE: '#60cdfc',
  DARK_BLUE: '#3d63fc',
  PURPLE: '#8b26eb',
  PINK: '#fc72da',
  WHITE: '#fff',
  BLACK: '#000'
} as const

export const CURSORS: Cursor[] = [
  {
    name: 'pointer',
    imageUrl: '/imgs/tools/pointer.png',
    position: { x: 6, y: 3 }
  },
  {
    name: 'brush',
    imageUrl: '/imgs/tools/brush.png',
    position: { x: 2, y: 14 },
    colorImageUrl: '/imgs/tools/brush_color.png'
  },
  {
    name: 'bucket',
    imageUrl: '/imgs/tools/bucket.png',
    position: { x: 3, y: 8 },
    colorImageUrl: '/imgs/tools/bucket_color.png'
  },
  {
    name: 'eraser',
    imageUrl: '/imgs/tools/eraser.png',
    position: { x: 5, y: 13 }
  },
  {
    name: 'colorPicker',
    imageUrl: '/imgs/tools/color-picker.png',
    position: { x: 3, y: 12 }
  }
]

export const SPRITES_RESOLUTION = 16
export const SPRITES_SIZE = 96

export const EVENTS = {
  OPEN_CONTEXT_MENU: '$open-context-menu',
  CLOSE_CONTEXT_MENU: '$close-context-menu'
} as const

export const Z_INDEX = {
  CUSTOM_CURSOR: 'z-9999',
  CONTEXT_MENU: 'z-999',
  NAVBAR: 'z-99'
} as const

export enum CLICK_BUTTON {
  LEFT,
  MIDDLE,
  RIGHT
}
