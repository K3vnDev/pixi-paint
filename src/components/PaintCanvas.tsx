'use client'

import { PIXEL_ART_RES } from '@consts'
import { useEffect, useRef } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
  const canvas = usePaintStore(s => s.canvas)
  const paintCanvasPixel = usePaintStore(s => s.paintCanvasPixel)
  const selectedColor = usePaintStore(s => s.color)

  const canvasRef = useRef<HTMLDivElement | null>(null)

  const gridTemplateColumns = `repeat(${PIXEL_ART_RES}, minmax(0, 1fr))`

  // Triggered on move and click
  const handlePointer = (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Extract pixel index and valdate it
    const element = e.target as HTMLDivElement
    const extractedIndex = +(element.getAttribute('data-pixel-index') ?? NaN)

    if (Number.isNaN(extractedIndex)) return

    const pixel = canvas[extractedIndex]

    if (e.buttons === 1 && pixel.color !== selectedColor) {
      paintCanvasPixel(extractedIndex)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener('pointermove', handlePointer)
      canvasRef.current.addEventListener('pointerdown', handlePointer)
    }

    return () => {
      canvasRef.current?.removeEventListener('pointermove', handlePointer)
      canvasRef.current?.removeEventListener('pointerdown', handlePointer)
    }
  }, [canvasRef.current])

  return (
    <div
      className='content-center size-[700px] grid'
      style={{ gridTemplateColumns }}
      onDragStart={e => e.preventDefault()}
      draggable={false}
      ref={canvasRef}
    >
      {canvas.map((pixel, i) => (
        <Pixel color={pixel.color} index={i} key={i} />
      ))}
    </div>
  )
}
