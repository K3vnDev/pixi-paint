import { firstToUpper } from './firstToUpper'

export const parseKebabName = (kName: string) => {
  const words = kName.split('-').map(w => firstToUpper(w))
  return words.join(' ')
}
