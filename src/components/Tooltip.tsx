'use client'

import { Z_INDEX } from '@consts'
import type { Origin, TooltipDetail } from '@types'
import { useRef, useState } from 'react'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useTouchChecking } from '@/hooks/useTouchChecking'

export const Tooltip = () => {
  const [text, setText] = useState('')
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useFreshRefs(isVisible)
  const [isTowardsRight, setIsTowardsRight] = useState(true)
  const isUsingTouch = useTouchChecking()

  const OFFSET_X = isUsingTouch ? 64 : 32

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
    const { innerWidth } = window

    const isOnLeftScreen = x < innerWidth / 2
    setIsTowardsRight(isOnLeftScreen)

    style.top = `${y - height / 2}px`
    style.left = `${x}px`
  }

  const visibilityStyle = !isVisible || !text.trim() ? 'opacity-0 scale-65' : ''

  const baseOrientationStyle: React.CSSProperties = isTowardsRight
    ? { translate: `${OFFSET_X}px 0` }
    : { translate: `calc(-100% - ${OFFSET_X}px) 0` }

  const squareOrientationStyle = isTowardsRight
    ? 'left-0 -translate-x-[calc(50%+1px)] rotate-45'
    : 'right-0 translate-x-[calc(50%+1px)] -rotate-135'

  return (
    <span
      className={`
        fixed ${Z_INDEX.TOOLTIP}
        bg-theme-bg text-theme-10 border-2 border-theme-10
        px-4 py-1.5 rounded-xl shadow-card text-xl origin-left 
        transition-[opacity,scale] duration-100 pointer-events-none text-nowrap 
        ${visibilityStyle} ${baseOrientationStyle}
      `}
      style={baseOrientationStyle}
      ref={elementRef}
    >
      <div
        className={`
          absolute size-[21px] bg-theme-bg border-b-2 border-l-2 border-theme-10
          top-1/2 -translate-y-1/2 ${squareOrientationStyle}
        `}
      />
      {text.trim()}
    </span>
  )
}
