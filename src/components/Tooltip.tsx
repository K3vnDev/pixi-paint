'use client'

import { Z_INDEX } from '@consts'
import type { Origin, TooltipDetail } from '@types'
import { useRef, useState } from 'react'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'

export const Tooltip = () => {
  const [text, setText] = useState('')
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useFreshRefs(isVisible)

  const OFFSET = { X: 45, Y: 10 }

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)

  useEvent(
    'pointermove',
    (e: PointerEvent) => {
      if (!elementRef.current || !isVisibleRef.current) return

      const { clientX, clientY } = e
      setPosition({ x: clientX, y: clientY })
    },
    { capture: true }
  )

  useEvent('$show-tooltip', ({ detail }: CustomEvent<TooltipDetail>) => {
    const { text, position } = detail
    setText(text)
    position && setPosition(position)
    show()
  })

  useEvent('$hide-tooltip', hide)

  const setPosition = ({ x, y }: Origin) => {
    if (!elementRef.current) return

    const { style } = elementRef.current
    const { height } = elementRef.current.getBoundingClientRect()

    style.top = `${y - height / 2 + OFFSET.Y}px`
    style.left = `${x + OFFSET.X}px`
  }

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
