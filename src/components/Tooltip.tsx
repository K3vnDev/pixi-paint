'use client'

import { EVENTS, Z_INDEX } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { useFreshRefs } from '@/hooks/useFreshRefs'

export const Tooltip = () => {
  const [text, setText] = useState('')
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useFreshRefs(isVisible)

  const OFFSET = { X: 45, Y: 10 }

  useEffect(() => {
    const handlePointer = (e: PointerEvent) => {
      if (!elementRef.current || !isVisibleRef.current) return
      const { clientX, clientY } = e
      const { height } = elementRef.current.getBoundingClientRect()
      const { style } = elementRef.current

      style.top = `${clientY - height / 2 + OFFSET.Y}px`
      style.left = `${clientX + OFFSET.X}px`
    }

    document.addEventListener('pointermove', handlePointer, { capture: true })
    return () => document.removeEventListener('pointermove', handlePointer, { capture: true })
  }, [])

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)

  useEffect(() => {
    const handleShowTooltip = (e: Event) => {
      const { detail } = e as CustomEvent
      setText(detail.text)
      show()
    }

    document.addEventListener(EVENTS.SHOW_TOOLTIP, handleShowTooltip)
    document.addEventListener(EVENTS.HIDE_TOOLTIP, hide)

    return () => {
      document.removeEventListener(EVENTS.SHOW_TOOLTIP, handleShowTooltip)
      document.removeEventListener(EVENTS.HIDE_TOOLTIP, hide)
    }
  })

  const style = !isVisible || !text.trim() ? 'opacity-0 scale-65' : ''

  return (
    <span
      className={`
        fixed ${Z_INDEX.TOOLTIP}
        bg-theme-bg text-theme-10 border-2 border-theme-10
        px-4 py-1.5 rounded-xl shadow-card text-xl origin-left 
        ${style} transition duration-100 pointer-events-none
      `}
      ref={elementRef}
    >
      <div
        className={`
          size-[21px] bg-theme-bg border-b-2 border-l-2 border-theme-10 rotate-45 absolute
          top-1/2 -translate-y-1/2 left-0 -translate-x-[calc(50%+1px)]
        `}
      />
      {text.trim()}
    </span>
  )
}
