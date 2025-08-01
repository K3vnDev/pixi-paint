import { useEffect, useRef, useState } from 'react'

export const useDebounce = <T>(value: T, wait: number) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  const firstTrigger = useRef(true)
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (firstTrigger.current) {
      firstTrigger.current = false
      return
    }

    timeout.current && clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setDebouncedValue(value)
    }, wait)

    return () => {
      timeout.current && clearTimeout(timeout.current)
    }
  }, [value])

  return debouncedValue
}
