import { EVENTS } from '@consts'
import type { Origin, TooltipDetail } from '@types'
import { useEffect, useState } from 'react'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  text: string
  showWhen?: boolean
}

export const useTooltip = ({ ref: elementRef, text, showWhen = true }: Params) => {
  const [isBeingShown, setIsBeingShown] = useState(false)
  const refs = useFreshRefs({ showWhen, text })

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

  useEvent(
    'pointerenter',
    (e: PointerEvent) => {
      show({ x: e.clientX, y: e.clientY })
    },
    { capture: true, target: elementRef }
  )
  useEvent('pointerleave', hide, { capture: true, target: elementRef })

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
