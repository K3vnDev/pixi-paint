import { useEffect } from 'react'

interface Params {
  resetOnLoad?: boolean
}

export const useScroll = ({ resetOnLoad = false }: Params = {}) => {
  useEffect(() => {
    if (resetOnLoad) {
      window.scrollTo({ top: 0, left: 0 })
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])
}
