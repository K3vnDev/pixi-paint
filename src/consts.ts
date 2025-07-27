export enum MODES {
  NONE,
  PAINT,
  ERASE
}

export const PIXEL_ART_RES = 8

export const INITIAL_BG = '#FFF'

// Store
export const BLANK_CANVAS = Array.from({ length: PIXEL_ART_RES ** 2 }, () => ({ color: INITIAL_BG }))
export const BLANK_DRAFT = { id: 'draft', pixels: BLANK_CANVAS }

// LocalStorage keys
export const LS_DRAFT_KEY = 'draft-canvas'
export const LS_SAVED_CANVASES_KEY = 'saved-canvases'
