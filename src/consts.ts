export enum MODES {
  NONE,
  PAINT,
  ERASE
}

export const PIXEL_ART_RES = 8

export const INITIAL_BG = '#FFF'

// Store
export const INITIAL_CANVAS = Array.from({ length: PIXEL_ART_RES ** 2 }, () => ({ color: INITIAL_BG }))

// LocalStorage keys
export const LS_DRAFT_KEY = 'draft-canvas'
