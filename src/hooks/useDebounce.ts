import { useEffect, useRef, useState } from 'react'
import { useFreshRefs } from './useFreshRefs'
import { useTimeout } from './useTimeout'

export const useDebounce = <T>(value: T, wait: number, refresh = false) => {
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
