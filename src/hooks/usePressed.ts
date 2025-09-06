import { useState } from 'react'
import { CLICK_BUTTON } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useEvent } from './useEvent'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  onPressStartDown?: () => void
  onPressStartEnter?: () => void
  onPressEndUp?: () => void
  onPressEndLeave?: () => void
  clickButtons?: Array<CLICK_BUTTON.LEFT | CLICK_BUTTON.RIGHT>
}

export const usePressed = ({
  ref: target,
  onPressStartDown,
  onPressStartEnter,
  onPressEndUp,
  onPressEndLeave,
  clickButtons = [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT]
}: Params) => {
  const [isPressed, setIsPressed] = useState(false)

  const clicked = (e: PointerEvent) => {
    const btn = (e.buttons - 1) * 2 // Normalize to 0 (left), 2 (right)
    return clickIncludes(btn, ...clickButtons)
  }

  // Event handlers to manage the pressed state
  useEvent(
    'pointerenter',
    (e: PointerEvent) => {
      e.stopPropagation()
      if (clicked(e)) {
        setIsPressed(true)
        onPressStartEnter?.()
      }
    },
    { target }
  )
  useEvent(
    'pointerdown',
    (e: PointerEvent) => {
      e.stopPropagation()
      if (clicked(e)) {
        setIsPressed(true)
        onPressStartDown?.()
      }
    },
    { target }
  )
  useEvent(
    'pointerup',
    (e: PointerEvent) => {
      e.stopPropagation()
      setIsPressed(false)
      onPressEndUp?.()
    },
    { target }
  )
  useEvent(
    'pointerleave',
    (e: PointerEvent) => {
      e.stopPropagation()
      setIsPressed(false)
      onPressEndLeave?.()
    },
    { target }
  )

  return { isPressed }
}
