import { useEvent } from './useEvent'

export const useDefaultPrevention = () => {
  const preventDefault = (e: Event) => {
    e.preventDefault()
  }
  useEvent('dragstart', preventDefault, { target: 'window' })
  useEvent('contextmenu', preventDefault, { target: 'window' })
}
