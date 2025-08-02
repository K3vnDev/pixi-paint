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
    if (index !== undefined) {
      clearInterval(intervalsRef.current[index] ?? 0)
      intervalsRef.current[index] = null
      return
    }
    // Stop all intervals
    intervalsRef.current.forEach((_, i) => {
      stopInterval(i)
    })
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
