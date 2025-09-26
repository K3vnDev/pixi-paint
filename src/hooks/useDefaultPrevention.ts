import { CLICK_BUTTON } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useEvent } from './useEvent'

export const useDefaultPrevention = () => {
  const preventDefault = (e: Event) => {
    e.preventDefault()
  }

  useEvent('dragstart', preventDefault, { target: 'window' })

  useEvent('contextmenu', preventDefault, { target: 'window' })

  useEvent('mousedown', (e: MouseEvent) => {
    if (clickIncludes(e.button, CLICK_BUTTON.MIDDLE)) e.preventDefault()
  })
}
