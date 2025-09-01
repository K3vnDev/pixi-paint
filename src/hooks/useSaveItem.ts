import { useEffect, useRef } from 'react'
import { useDebounce } from './useDebounce'

interface Params<T> {
  watchItem: T
  key: string
  getter?: (debouncedValue: T) => any | undefined
  delay?: number
}

export const useSaveItem = <T>({ watchItem, key, getter = i => i, delay = 400 }: Params<T>) => {
  const debouncedItem = useDebounce(watchItem, delay)
  const isFirstTrigger = useRef(true)

  useEffect(() => {
    if (isFirstTrigger.current) {
      isFirstTrigger.current = false
      return
    }
    const toSaveItem = getter(debouncedItem)
    toSaveItem !== undefined && localStorage.setItem(key, JSON.stringify(toSaveItem))
  }, [debouncedItem])
}
