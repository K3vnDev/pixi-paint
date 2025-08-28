import { EVENTS } from '@consts'
import type { Origin, TooltipDetail } from '@types'
import { useEffect, useState } from 'react'
import { useFreshRefs } from './useFreshRefs'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  text: string
  showWhen?: boolean
}

export const useTooltip = ({ ref, text, showWhen = true }: Params) => {
  const [isBeingShown, setIsBeingShown] = useState(false)
  const refs = useFreshRefs({ showWhen, text })

  useEffect(() => {
    if (!ref.current) return
    const element: HTMLElement = ref.current

    const handlePointerEnter = (e: PointerEvent) => {
      show({ x: e.clientX, y: e.clientY })
    }

    element.addEventListener('pointerenter', handlePointerEnter, { capture: true })
    element.addEventListener('pointerleave', hide, { capture: true })

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter, { capture: true })
      element.removeEventListener('pointerleave', hide, { capture: true })
    }
  }, [])

  const show = (position?: Origin) => {
    const text = refs.current.text.trim()
    if (!refs.current.showWhen || !text) return

    const detail: TooltipDetail = { text, position }
    document.dispatchEvent(new CustomEvent(EVENTS.SHOW_TOOLTIP, { detail }))
    setIsBeingShown(true)
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
