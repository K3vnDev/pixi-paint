import { useEffect, useState } from 'react'
import { EVENTS } from '@/consts'
import { useFreshRef } from './useFreshRef'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  text: string
  showWhen?: boolean
}

export const useTooltip = ({ ref, text, showWhen = true }: Params) => {
  const [isBeingShown, setIsBeingShown] = useState(false)
  const refs = useFreshRef({ showWhen, text })

  useEffect(() => {
    if (!ref.current) return
    const element: HTMLElement = ref.current

    element.addEventListener('pointerenter', show, { capture: true })
    element.addEventListener('pointerleave', hide, { capture: true })

    return () => {
      element.removeEventListener('pointerenter', show)
      element.removeEventListener('pointerleave', hide)
    }
  }, [])

  const show = () => {
    if (refs.current.showWhen) {
      const { text } = refs.current
      if (!text.trim()) return

      document.dispatchEvent(new CustomEvent(EVENTS.SHOW_TOOLTIP, { detail: { text } }))
      setIsBeingShown(true)
    }
  }

  const hide = () => {
    document.dispatchEvent(new CustomEvent(EVENTS.HIDE_TOOLTIP))
    setIsBeingShown(false)
  }

  useEffect(() => {
    if (!showWhen && isBeingShown) {
      hide()
    }
  }, [showWhen, isBeingShown])

  useEffect(() => {
    if (isBeingShown) {
      show()
    }
  }, [text])

  return { isShowingTooltip: isBeingShown }
}
