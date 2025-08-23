import { useEffect } from 'react'
import { useGeneralStore } from '@/store/useGeneralStore'
import { useFreshRefs } from './useFreshRefs'

type Params = {
  key?: string | string[]
  action: (event: KeyboardEvent) => void
  deps?: unknown[]
  options?: {
    allowShiftKey?: boolean
    allowCtrlKey?: boolean
    allowOnInput?: boolean
  }
}

export const useActionOnKey = ({ key, action, deps = [], options = {} }: Params) => {
  const isUsingInput = useGeneralStore(s => s.isUsingInput)
  const isUsingInputRef = useFreshRefs(isUsingInput)

  useEffect(() => {
    const { allowShiftKey, allowCtrlKey, allowOnInput } = options

    const handleKeyDown = (e: KeyboardEvent) => {
      const { ctrlKey, shiftKey, key: pressedKey } = e
      const keys = typeof key === 'string' ? [key] : key

      if (
        !(!allowCtrlKey && ctrlKey) &&
        !(!allowShiftKey && shiftKey) &&
        !keys?.every(k => k.toUpperCase() !== pressedKey.toUpperCase()) &&
        !(!allowOnInput && isUsingInputRef.current)
      ) {
        e.preventDefault()
        e.stopPropagation()
        action(e)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, deps)
}
