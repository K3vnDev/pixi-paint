import { useGeneralStore } from '@/store/useGeneralStore'
import { getSafeWinDoc } from '@/utils/getSafeWinDoc'
import { useEvent } from './useEvent'
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

  useEvent(
    'keydown',
    (e: KeyboardEvent) => {
      const { ctrlKey, shiftKey, key: pressedKey } = e
      const keys = typeof key === 'string' ? [key] : key
      const { allowShiftKey, allowCtrlKey, allowOnInput } = options

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
    },
    {
      target: getSafeWinDoc().window,
      deps
    }
  )
}
