'use client'

import { CURSOR_SIZE, CURSORS } from '@consts'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePaintStore } from '@/store/usePaintStore'

export const CustomCursor = () => {
  const cursorsContainerRef = useRef<HTMLDivElement | null>(null)

  const tool = usePaintStore(s => s.tool)
  const toolRef = useRef(tool)

  const isHoveringPaintCanvas = useRef(false)
  const isPreservingHoveringState = useRef(false)

  const pointerPosition = useRef({ x: 0, y: 0 })
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0)

  const [isShowingCursor, setIsShowingCursor] = useState(true)

  // Tool main movement
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Check if its hovering paint canvas and preseve its state when moving out while holding the button
      const newIsHoveingPaintCanvas = !!(e.target as Element).closest('#paint-canvas')
      if (!newIsHoveingPaintCanvas && isHoveringPaintCanvas.current && e.buttons) {
        isPreservingHoveringState.current = true
      }
      isHoveringPaintCanvas.current = isPreservingHoveringState.current || newIsHoveingPaintCanvas

      // Refresh pointer position and cursor
      pointerPosition.current = { x: e.clientX, y: e.clientY }
      refreshCursor()
    }

    const handlePointerUp = () => {
      isPreservingHoveringState.current = false
    }

    window.addEventListener('pointermove', handlePointerMove, { capture: true })
    window.addEventListener('pointerup', handlePointerUp, { capture: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const refreshCursor = () => {
    if (!cursorsContainerRef.current) return

    const newCursorIndex = isHoveringPaintCanvas.current ? +toolRef.current : 0
    const { x: clientX, y: clientY } = pointerPosition.current

    for (const el of cursorsContainerRef.current.childNodes) {
      ;(el as HTMLDivElement).style.transform = `translate(${clientX}px, ${clientY}px)`
    }
    setCurrentCursorIndex(newCursorIndex)
    setIsShowingCursor(true)
  }

  // Refresh tool ref
  useEffect(() => {
    toolRef.current = tool
    refreshCursor()
  }, [tool])

  // Handle pointer visibility
  useEffect(() => {
    const handlePointerLeave = (e: PointerEvent) => {
      e.stopPropagation()
      setIsShowingCursor(false)
    }
    const handlePointerEnter = (e: PointerEvent) => {
      e.stopPropagation()
      setIsShowingCursor(true)
    }

    document.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('pointerenter', handlePointerEnter)

    return () => {
      document.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('pointerenter', handlePointerEnter)
    }
  }, [isShowingCursor])

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

const Cursor = ({ name, url, x, y, index, selectedIndex, show }: CursorProps) => {
  const style: React.CSSProperties = {
    imageRendering: 'pixelated',
    top: `${-y}px`,
    left: `${-x}px`
  }

  const visibility = index === selectedIndex && show ? 'opacity-100' : 'opacity-0'

  return (
    <div
      className={`
        fixed z-[9999] pointer-events-none 
        transition-opacity duration-[90ms] ${visibility}
      `}
      style={style}
    >
      <Image
        unoptimized
        src={url}
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        alt={`The custom cursor of the app, showing a ${name}.`}
      />
    </div>
  )
}
