import { useEffect, useState } from 'react'

export function useTouchChecking() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)')
    setIsTouch(mql.matches)

    // Media query listener
    const updateFromMql = (e: any) => setIsTouch(e.matches)

    // Pointer fallback
    const handlePointer = (e: any) => {
      if (e.pointerType === 'touch') {
        setIsTouch(true)
      }
    }

    mql.addEventListener('change', updateFromMql)
    window.addEventListener('pointerdown', handlePointer)

    return () => {
      mql.removeEventListener('change', updateFromMql)
      window.removeEventListener('pointerdown', handlePointer)
    }
  }, [])

  return isTouch
}
