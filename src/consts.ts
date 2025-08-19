import type { Cursor, SavedCanvas } from '@types'

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
  WHITE: '#ffffff',
  BLACK: '#000000'
} as const

export const DEFAULT_PRI_COLOR = COLOR_PALETTE.RED
export const DEFAULT_SEC_COLOR = COLOR_PALETTE.WHITE

export enum TOOLS {
  NONE,
  BRUSH,
  BUCKET,
  ERASER,
  COLOR_PICKER
}

export const CANVAS_RESOLUTION = 8

export const WHEEL_SWITCH_TOOL_COOLDOWN = 110
export const BUCKET_INTERVAL_TIME = 55

// Store
export const BLANK_PIXELS = Array.from({ length: CANVAS_RESOLUTION ** 2 }, () => DEFAULT_SEC_COLOR)
export const BLANK_DRAFT: SavedCanvas = { id: 'draft', pixels: BLANK_PIXELS }

// LocalStorage keys
export const LS_DRAFT_CANVAS_KEY = 'draft-canvas'
export const LS_SAVED_CANVASES_KEY = 'saved-canvases'
export const LS_EDITING_CANVAS_ID_KEY = 'editing-canvas-id'

export const CURSORS: Cursor[] = [
  {
    imageName: 'pointer',
    origin: { x: 6, y: 3 }
  },
  {
    imageName: 'brush',
    origin: { x: 2, y: 14 },
    colorize: 'primary'
  },
  {
    imageName: 'bucket',
    origin: { x: 3, y: 8 },
    colorize: 'primary'
  },
  {
    imageName: 'eraser',
    origin: { x: 5, y: 13 },
    colorize: 'secondary'
  },
  {
    imageName: 'color-picker',
    origin: { x: 3, y: 12 }
  }
]

export const SPRITES_RESOLUTION = 16
export const SPRITES_SIZE = 96

export const EVENTS = {
  OPEN_CONTEXT_MENU: '$open-context-menu',
  CLOSE_CONTEXT_MENU: '$close-context-menu',
  CONTEXT_MENU_CLOSED: '$context-menu-closed',
  SHOW_TOOLTIP: '$show-tooltip',
  HIDE_TOOLTIP: '$hide-tooltip'
} as const

export const Z_INDEX = {
  CUSTOM_CURSOR: 'z-99999',
  CONTEXT_MENU: 'z-9999',
  TOOLTIP: 'z-999',
  NAVBAR: 'z-99'
} as const

export enum CLICK_BUTTON {
  LEFT,
  MIDDLE,
  RIGHT
}

export const HTML_IDS = {
  PAINT_CANVAS: 'paint-canvas',
  CONTEXT_MENU: 'context-menu',
  PICKER_MENU: 'picker-menu'
} as const
