import { getSafeWinDoc } from '@/utils/getSafeWinDoc'
import { useEvent } from './useEvent'

export const useBasicPrevention = () => {
  const preventDefault = (e: Event) => {
    e.preventDefault()
  }
  useEvent('dragstart', preventDefault, { target: getSafeWinDoc().window })
  useEvent('contextmenu', preventDefault, { target: getSafeWinDoc().window })
}
