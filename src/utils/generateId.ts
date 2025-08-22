const ID_LENGTH = 3

/**
 * Generates a random ID consisting of letters and numbers.
 *
 * @param {function} [checkCallback] - Optional callback used to validate the generated ID.
 * The function receives the generated ID as a parameter and should return:
 * - `true` → if the ID is valid/unique.
 * - `false` → if the ID is invalid or already taken (a new one will be generated).
 *
 * @returns {string} A valid unique ID.
 */
export const generateId = (checkCallback?: (id: string) => boolean): string => {
  let id = ''

  for (let i = 0; i < ID_LENGTH; i++) {
    if (Math.random() > 0.6) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      id += randomLetter
      continue
    }
    id += Math.floor(Math.random() * 10)
  }

  return checkCallback?.(id) === false ? generateId(checkCallback) : id
}
