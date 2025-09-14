import { useEffect } from 'react'

export const useResetScroll = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [])
}
