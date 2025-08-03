import { useEffect, useRef } from 'react'

export type DependencyList = any[] | null
export type OnStop = (index: number) => void

interface Params {
  types:
    | { clearTimer: typeof clearInterval; setTimer: typeof setInterval }
    | { clearTimer: typeof clearTimeout; setTimer: typeof setTimeout }

  attrs: {
    dependencyList: DependencyList
    onStop?: OnStop
  }
}

export const useTimerHandler = ({
  attrs: { dependencyList, onStop },
  types: { setTimer, clearTimer }
}: Params) => {
  const timersRef = useRef<Array<ReturnType<typeof setTimer> | null>>([])

  const getFreeTimerHandlerIndex = () => {
    for (let i = 0; i < timersRef.current.length; i++) {
      if (timersRef.current[i] === null) return i
    }
    return timersRef.current.length
  }

  const start = (callback: () => void, delay: number) => {
    const index = getFreeTimerHandlerIndex()
    timersRef.current[index] = setTimer(callback, delay)
    return index
  }

  const stop = (index?: number) => {
    // Stop specific timer
    if (index !== undefined) {
      onStop?.(index)
      clearTimer(timersRef.current[index] ?? 0)
      timersRef.current[index] = null
      return
    }
    // Stop all timers
    timersRef.current.forEach((_, i) => {
      stop(i)
    })
  }

  // Cleanup timer
  useEffect(
    () => () => {
      if (dependencyList !== null) stop()
    },
    dependencyList ?? []
  )

  return { start, stop }
}
