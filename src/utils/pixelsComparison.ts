import { colorComparison } from './colorComparison'

const MAX_DIFF = 3

export const pixelsComparison = (a: string[], b: string[]) => {
  if (a.length !== b.length && !a.length) return false
  let differenceCounter = 0

  for (let i = 0; i < a.length; i++) {
    if (!colorComparison(a[i], b[i]) && ++differenceCounter > MAX_DIFF) {
      return false
    }
  }
  return true
}
