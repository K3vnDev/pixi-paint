export const firstToUpper = (str: string) => {
  const upperChar = str.charAt(0).toUpperCase()
  return upperChar + str.slice(1)
}
