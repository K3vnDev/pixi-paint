import { useEffect } from 'react'
import { useDebounce } from './useDebounce'

interface Params<T> {
  watchItem: T
  key: string
  getter?: (debouncedValue: T) => any
  delay?: number
}

export const useSaveItem = <T>({ watchItem, key, getter = i => i, delay = 400 }: Params<T>) => {
  const debouncedItem = useDebounce(watchItem, delay)

  useEffect(() => {
    const toSaveItem = getter(debouncedItem)
    localStorage.setItem(key, JSON.stringify(toSaveItem))
  }, [debouncedItem])
}
