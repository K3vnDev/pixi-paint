import { useEffect, useRef } from 'react'

export const useInterval = (dependencyList: any[] | null = []) => {
  const intervalsRef = useRef<Array<ReturnType<typeof setInterval> | null>>([])

  const getFreeIntervalIndex = () => {
    for (let i = 0; i < intervalsRef.current.length; i++) {
      if (intervalsRef.current[i] === null) return i
    }
    return intervalsRef.current.length
  }

  const startInterval = (callback: () => void, delay: number) => {
    const index = getFreeIntervalIndex()
    intervalsRef.current[index] = setInterval(callback, delay)
    return index
  }

  const stopInterval = (index?: number) => {
    const stopIntervalIndex = (i: number) => {
      intervalsRef.current[i] && clearInterval(intervalsRef.current[i])
      intervalsRef.current[i] = null
    }

    // Stop specific index interval
    if (index !== undefined) {
      stopIntervalIndex(index)
      return
    }

    // Stop all intervals
    intervalsRef.current.forEach((_, i) => stopIntervalIndex(i))
  }

  // Cleanup interval
  useEffect(
    () => () => {
      if (dependencyList !== null) stopInterval()
    },
    dependencyList ?? []
  )

  return { startInterval, stopInterval }
}
