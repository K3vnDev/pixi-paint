import { useEffect } from 'react'

interface Options {
  allowShiftKey?: boolean
  allowCtrlKey?: boolean
}

export const useActionOnKey = (
  key: string | string[],
  action: (event: KeyboardEvent) => void,
  dependencies: unknown[] = [],
  options: Options = {}
) => {
  useEffect(() => {
    const { allowShiftKey, allowCtrlKey } = options

    const handleKeyDown = (e: KeyboardEvent) => {
      const { ctrlKey, shiftKey, key: pressedKey } = e
      const keys = typeof key === 'string' ? [key] : key

      if (
        !!allowCtrlKey === ctrlKey &&
        !!allowShiftKey === shiftKey &&
        keys.some(k => k.toUpperCase() === pressedKey.toUpperCase())
      ) {
        e.preventDefault()
        e.stopPropagation()
        action(e)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, dependencies)
}
