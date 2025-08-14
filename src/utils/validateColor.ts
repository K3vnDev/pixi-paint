import { COLOR_PALETTE } from '@consts'

interface ValidateColorReturnType {
  value: string
  isValid: boolean
}

export const validateColor = (color: string): ValidateColorReturnType => {
  let cleaned = color.replaceAll('#', '').slice(0, 6).toLowerCase()
  const { BLACK } = COLOR_PALETTE

  // Return black if theres no input but keep it valid
  if (!cleaned.length) {
    return { value: BLACK, isValid: true }
  }

  // Ensure there are no 4 or 5 chars long values
  if (cleaned.length < 6) {
    cleaned = cleaned.slice(0, 3)
  }

  const isValid = validateHex(cleaned)
  const hashCleaned = `#${cleaned}`

  // Return black if its invalid
  if (!isValid) {
    return { value: BLACK, isValid: false }
  }

  // Handle 6 chars
  if (cleaned.length === 6) {
    return { value: hashCleaned, isValid: true }
  }

  // Handle 1, 2 or 3  chars
  const colorParsers = [
    () => cleaned.repeat(6),
    () => cleaned.repeat(3),
    () => {
      const [r, g, b] = cleaned
      return `${r}${r}${g}${g}${b}${b}`
    }
  ]

  return {
    value: `#${colorParsers[cleaned.length - 1]()}`,
    isValid: true
  }
}

const validateHex = (str: string): boolean => /^[0-9a-fA-F]+$/.test(str)
