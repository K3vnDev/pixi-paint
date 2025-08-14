import { useEffect, useRef, useState } from 'react'
import { useFreshRef } from './useFreshRef'
import { useTimeout } from './useTimeout'

export const useDebounce = <T>(value: T, wait: number, refresh = false) => {
  const { startTimeout, stopTimeout } = useTimeout()
  const firstTrigger = useRef(true)
  const [debouncedValue, setDebouncedValue] = useState(value)

  const isOnTimeout = useRef(false)
  const latestValueRef = useFreshRef(value)

  useEffect(() => {
    if (firstTrigger.current) {
      firstTrigger.current = false
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

  return debouncedValue
}
