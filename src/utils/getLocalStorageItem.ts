export const getLocalStorageItem = <T>(key: string, defaultValue: T) => {
  if (typeof window === 'undefined') return defaultValue

  const item = window.localStorage.getItem(key)
  try {
    if (item === null) throw new Error()
    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}
