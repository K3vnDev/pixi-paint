'use client'

import { CURSORS, SPRITES_RESOLUTION, SPRITES_SIZE, Z_INDEX } from '@consts'
import { useEffect, useMemo, useState } from 'react'
import { useTimeout } from '@/hooks/timer-handlers/useTimeout'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import type { Cursor as CursorType } from '@/types'
import { CursorImage } from './CursorImage'

export const CustomCursor = () => {
  const { currentCursorIndex, cursorsContainerRef, isShowingCursor, isUsingTouch } = useCustomCursor()

  return !isUsingTouch ? (
    <div ref={cursorsContainerRef}>
      {CURSORS.map((cursor, i) => (
        <Cursor
          {...cursor}
          selectedIndex={currentCursorIndex}
          key={cursor.imageName}
          show={isShowingCursor}
          index={i}
        />
      ))}
    </div>
  ) : null
}

type CursorProps = {
  index: number
  selectedIndex: number
  show: boolean
} & CursorType

const Cursor = ({ index, selectedIndex, show, ...cursor }: CursorProps) => {
  // biome-ignore format: <>
  const {  origin: { x, y } } = cursor
  const isVisible = index === selectedIndex && show

  const [animation, setAnimation] = useState('')
  const { startTimeout, stopTimeout } = useTimeout([])

  useEffect(() => {
    if (isVisible && !animation) {
      setAnimation('animate-pop')
      startTimeout(() => {
        setAnimation('')
        stopTimeout()
      }, 400)
    }
  }, [isVisible])

  const style: React.CSSProperties = useMemo(
    () => ({
      imageRendering: 'pixelated',
      top: `${(-y * SPRITES_SIZE) / SPRITES_RESOLUTION}px`,
      left: `${(-x * SPRITES_SIZE) / SPRITES_RESOLUTION}px`,
      width: `${SPRITES_SIZE}px`,
      height: `${SPRITES_SIZE}px`
    }),
    [x, y]
  )

  const visibility = isVisible ? '' : 'opacity-0'

  return (
    <div
      className={`
        fixed ${Z_INDEX.CUSTOM_CURSOR} pointer-events-none 
        transition-opacity duration-75 ${visibility}
      `}
      style={style}
    >
      <CursorImage className={{ both: animation }} {...cursor} alt={`The custom cursor of the app.`} />
    </div>
  )
}
