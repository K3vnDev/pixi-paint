import { useEffect, useRef, useState } from 'react'
import { CLICK_BUTTON } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useEvent } from './useEvent'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  onPressStart?: () => void
  onPressEnd?: () => void
}

export const usePressed = ({ ref: target, onPressStart, onPressEnd }: Params) => {
  const [isPressed, setIsPressed] = useState(false)
  const firstRender = useRef(true)

  // Call the corresponding callbacks when isPressed changes, skipping the first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    isPressed ? onPressStart?.() : onPressEnd?.()
  }, [isPressed])

  const clicked = (e: PointerEvent) => {
    const btn = (e.buttons - 1) * 2 // Normalize to 0 (left), 1 (middle), 2 (right)
    return clickIncludes(btn, CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT)
  }

  // Event handlers to manage the pressed state
  useEvent(
    'pointerenter',
    (e: PointerEvent) => {
      e.stopPropagation()
      clicked(e) && setIsPressed(true)
    },
    { target }
  )
  useEvent(
    'pointerdown',
    (e: PointerEvent) => {
      e.stopPropagation()
      clicked(e) && setIsPressed(true)
    },
    { target }
  )
  useEvent(
    'pointerup',
    (e: PointerEvent) => {
      e.stopPropagation()
      setIsPressed(false)
    },
    { target }
  )
  useEvent(
    'pointerleave',
    (e: PointerEvent) => {
      e.stopPropagation()
      setIsPressed(false)
    },
    { target }
  )

  return { isPressed }
}
