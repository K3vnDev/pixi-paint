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
export const CANVAS_PIXELS_LENGHT = CANVAS_RESOLUTION ** 2

export const WHEEL_SWITCH_TOOL_COOLDOWN = 110
export const BUCKET_INTERVAL_TIME = 55

// Store
export const BLANK_PIXELS = Array.from({ length: CANVAS_PIXELS_LENGHT }, () => COLOR_PALETTE.WHITE)
export const BLANK_DRAFT: SavedCanvas = { id: 'draft', pixels: BLANK_PIXELS } as const

export const LS_KEYS = {
  DRAFT_CANVAS: 'draft-canvas',
  SAVED_CANVASES: 'saved-canvases',
  EDITING_CANVAS_ID: 'editing-canvas-id',
  DOWNLOAD_SETTINGS: 'download-settings'
}

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

export const CANVASES_TRANSITION_MS = 350

export const ICON_NAMES = [
  'check',
  'clone',
  'cross',
  'download',
  'pencil',
  'trash',
  'arrows-corner',
  'warning',
  'save',
  'upload',
  'publish',
  'heart',
  'image',
  'code',
  'selection-mode',
  'loading',
  'share'
] as const

export const EVENTS = {
  OPEN_CONTEXT_MENU: '$open-context-menu',
  CLOSE_CONTEXT_MENU: '$close-context-menu',
  CONTEXT_MENU_CLOSED: '$context-menu-closed',

  SHOW_TOOLTIP: '$show-tooltip',
  HIDE_TOOLTIP: '$hide-tooltip',

  OPEN_DIALOG_MENU: '$open-dialog-menu',
  CLOSE_DIALOG_MENU: '$close-dialog-menu',
  DIALOG_MENU_CLOSED: '$dialog-menu-closed',

  PAINTED: '$painted'
} as const

export const Z_INDEX = {
  CUSTOM_CURSOR: 'z-999999',
  DIALOG_MENU: 'z-99999',
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
  PICKER_MENU: 'picker-menu',
  DIALOG_MENU: 'dialog-menu'
} as const

export const HTML_DATA_IDS = {
  CREATION_CANVAS_TARGET: 'creation-canvas-target'
} as const

export const API_ERRORS = {
  CANVAS_ALREADY_EXISTS: 'canvas-already-exists'
}
