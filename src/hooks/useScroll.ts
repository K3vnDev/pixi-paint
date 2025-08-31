import { useEffect } from 'react'
import { useEvent } from './useEvent'

interface Params {
  resetOnLoad?: boolean
}

export const useScroll = ({ resetOnLoad = false }: Params = {}) => {
  useEvent('mousedown', (e: MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault()
    }
  })

  useEffect(() => {
    if (resetOnLoad) {
      window.scrollTo({ top: 0, left: 0 })
    }
  }, [])
}
