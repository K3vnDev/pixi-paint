const ID_LENGTH = 3

export const generateId = () => {
  let id = ''

  for (let i = 0; i < ID_LENGTH; i++) {
    if (Math.random() > 0.6) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      id += randomLetter
      continue
    }
    id += Math.floor(Math.random() * 10)
  }
  return id
}
