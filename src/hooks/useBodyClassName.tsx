import { useEffect } from 'react'

export const useBodyClassName = (className: string) => {
  useEffect(() => {
    const { classList } = document.body

    classList.remove(className)
    classList.add(className)

    return () => classList.remove(className)
  }, [])
}
