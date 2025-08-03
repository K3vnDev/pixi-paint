'use client'

import { CURSOR_SIZE, CURSORS } from '@consts'
import { useEffect, useMemo, useState } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useTimeout } from '@/hooks/useTimeout'
import { CursorImage } from './CursorImage'

export const CustomCursor = () => {
  const { currentCursorIndex, cursorsContainerRef, isShowingCursor } = useCustomCursor()

  return (
    <div ref={cursorsContainerRef}>
      {CURSORS.map((cursor, i) => (
        <Cursor
          {...cursor}
          selectedIndex={currentCursorIndex}
          key={cursor.name}
          show={isShowingCursor}
          index={i}
        />
      ))}
    </div>
  )
}

type CursorProps = {
  index: number
  selectedIndex: number
  show: boolean
} & (typeof CURSORS)[number]

const Cursor = ({ index, selectedIndex, show, ...cursor }: CursorProps) => {
  // biome-ignore format: <>
  const { name, position: { x, y } } = cursor
  const SIZE = 96
  const isVisible = index === selectedIndex && show

  const [animation, setAnimation] = useState('')
  const { startTimeout } = useTimeout([])

  useEffect(() => {
    if (isVisible && !animation) {
      setAnimation('animate-pop')
      startTimeout(() => setAnimation(''), 400)
    }
  }, [isVisible])

  const style: React.CSSProperties = useMemo(
    () => ({
      imageRendering: 'pixelated',
      top: `${(-y * SIZE) / CURSOR_SIZE}px`,
      left: `${(-x * SIZE) / CURSOR_SIZE}px`,
      width: `${SIZE}px`,
      height: `${SIZE}px`
    }),
    [x, y]
  )

  const visibility = isVisible ? '' : 'opacity-0'

  return (
    <div
      className={`
        fixed z-[9999] pointer-events-none 
        transition-opacity duration-75 ${visibility}
      `}
      style={style}
    >
      <CursorImage
        className={{ both: animation }}
        {...cursor}
        alt={`The custom cursor of the app, showing a ${name}.`}
        size={SIZE}
      />
    </div>
  )
}
