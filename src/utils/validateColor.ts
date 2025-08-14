import { COLOR_PALETTE } from '@consts'

export const validateColor = (color: string) => {
  const sliced = color.replaceAll('#', '').slice(0, 6)
  if (!sliced) return COLOR_PALETTE.BLACK
  return `#${sliced}`
}
