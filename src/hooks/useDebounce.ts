import { useEffect, useRef, useState } from 'react'
import { useFreshRefs } from './useFreshRefs'
import { useTimeout } from './useTimeout'

/**
 * Debounce hook
 * @param value Value to debounce
 * @param wait Debounce time in milliseconds
 * @param refresh If true, the debounce timer will not reset if the value changes while the timer is active
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, wait: number, refresh = true) => {
  const { startTimeout, stopTimeout } = useTimeout()
  const isFirstTrigger = useRef(true)
  const [debouncedValue, setDebouncedValue] = useState(value)

  const isOnTimeout = useRef(false)
  const latestValueRef = useFreshRefs(value)

  useEffect(() => {
    if (isFirstTrigger.current || wait <= 0) {
      isFirstTrigger.current = false
      return
    }

    if (refresh && isOnTimeout.current) {
      return
    }

    stopTimeout()
    isOnTimeout.current = true

    startTimeout(() => {
      setDebouncedValue(latestValueRef.current)
      stopTimeout()
      isOnTimeout.current = false
    }, wait)
  }, [value])

  return wait <= 0 ? value : debouncedValue
}
