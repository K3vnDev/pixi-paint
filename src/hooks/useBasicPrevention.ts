import { useEffect } from 'react'

export const useBasicPrevention = () => {
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault()
    }

    window.addEventListener('dragstart', preventDefault)
    window.addEventListener('contextmenu', preventDefault)

    return () => {
      window.removeEventListener('dragstart', preventDefault)
      window.removeEventListener('contextmenu', preventDefault)
    }
  }, [])
}
