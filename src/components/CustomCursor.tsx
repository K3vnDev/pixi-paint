'use client'

import { CURSOR_SIZE, CURSORS } from '@consts'
import { useMemo } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
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

  const visibility = index === selectedIndex && show ? 'opacity-100' : 'opacity-0'

  return (
    <div
      className={`
        fixed z-[9999] pointer-events-none 
        transition-opacity duration-75 ${visibility}
      `}
      style={style}
    >
      <CursorImage {...cursor} alt={`The custom cursor of the app, showing a ${name}.`} size={SIZE} />
    </div>
  )
}
