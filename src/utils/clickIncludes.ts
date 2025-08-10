import type { CLICK_BUTTON } from '@consts'

export const clickIncludes = (btn: number, ...clicks: CLICK_BUTTON[]) => clicks.some(c => +c === btn)
