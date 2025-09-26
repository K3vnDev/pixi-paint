import type { Origin } from '@types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEvent } from './useEvent'

export const useResponsiveness = () => {
  const [screenSize, setScreenSize] = useState<Origin>({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)

  const handleResize = useCallback(() => {
    const { innerWidth, innerHeight } = window
    setScreenSize({ x: innerWidth, y: innerHeight })
    setLoaded(true)
  }, [])

  useEffect(handleResize, [])
  useEvent('resize', handleResize, { target: 'window' })

  const media = useMemo(() => {
    const { x } = screenSize
    return {
      sm: x >= 640,
      md: x >= 768,
      lg: x >= 1024,
      xl: x >= 1280,
      '2xl': x >= 1536
    }
  }, [screenSize])

  return { screenSize, loaded, media }
}
