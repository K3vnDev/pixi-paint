import { EVENTS } from '@consts'
import type { Origin, TooltipDetail } from '@types'
import { useEffect, useState } from 'react'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'
import { useTouchChecking } from './useTouchChecking'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  text: string
  showWhen?: boolean
  waitTime?: number
}

export const useTooltip = ({ ref: elementRef, text, showWhen = true }: Params) => {
  const [isBeingShown, setIsBeingShown] = useState(false)
  const refs = useFreshRefs({ showWhen, text })

  const isUsingTouchRef = useFreshRefs(useTouchChecking())

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

  const eventOptions = { capture: true, target: elementRef }

  useEvent(
    'pointerenter',
    (e: PointerEvent) => {
      if (!isUsingTouchRef.current) {
        show({ x: e.clientX, y: e.clientY })
      }
    },
    eventOptions
  )

  useEvent(
    'touchstart',
    (e: TouchEvent) => {
      const [{ clientX, clientY }] = e.touches
      show({ x: clientX, y: clientY })
    },
    eventOptions
  )

  useEvent('pointerleave', hide, eventOptions)

  useEffect(() => {
    !showWhen && isBeingShown && hide()
  }, [showWhen, isBeingShown])

  useEffect(() => {
    if (isBeingShown) {
      show()
    }
  }, [text])

  return { isShowingTooltip: isBeingShown }
}
