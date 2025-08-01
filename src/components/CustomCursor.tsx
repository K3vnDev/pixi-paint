'use client'

import { CURSOR_SIZE, CURSORS } from '@consts'
import Image from 'next/image'
import { useMemo } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { usePaintStore } from '@/store/usePaintStore'

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

const Cursor = ({
  name,
  imageUrl,
  position: { x, y },
  index,
  selectedIndex,
  show,
  colorImageUrl
}: CursorProps) => {
  const selectedColor = usePaintStore(s => s.color)
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
      <Image
        unoptimized
        className='absolute size-full aspect-square left-0 top-0 '
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        src={imageUrl}
        alt={`The custom cursor of the app, showing a ${name}.`}
      />
      {colorImageUrl && (
        <div
          style={{
            backgroundColor: selectedColor,
            WebkitMask: `url(${colorImageUrl}) no-repeat center / contain`,
            mask: `url(${colorImageUrl}) no-repeat center / contain`,
            width: SIZE,
            height: SIZE
          }}
        />
      )}
    </div>
  )
}
