export enum TOOLS {
  NONE,
  BRUSH,
  ERASER,
  BUCKET
}

export const PIXEL_ART_RES = 8

export const INITIAL_BG = '#FFF'

// Store
export const BLANK_CANVAS = Array.from({ length: PIXEL_ART_RES ** 2 }, () => INITIAL_BG)
export const BLANK_DRAFT = { id: 'draft', pixels: BLANK_CANVAS }

// LocalStorage keys
export const LS_DRAFT_KEY = 'draft-canvas'
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
