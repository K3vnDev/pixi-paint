import { useEffect, useRef } from 'react'
import { MODES } from '@/consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'

export const useCanvas = () => {
  const canvas = usePaintStore(s => s.canvas)
  const setCanvas = usePaintStore(s => s.setCanvas)

  const setCanvasPixel = usePaintStore(s => s.setCanvasPixel)
  const selectedColor = usePaintStore(s => s.color)
  const bgColor = usePaintStore(s => s.bgColor)
  const mode = usePaintStore(s => s.mode)

  const draft = useCanvasStore(s => s.draft)
  const hydrated = useCanvasStore(s => s.hydrated)

  const canvasRef = useRef<HTMLDivElement | null>(null)

  // Load draft canvas // TODO: IMPROVE
  useEffect(() => {
    if (canvas.length === 0 && hydrated) {
      setCanvas(draft.pixels)
    }
  }, [hydrated])

  useEffect(() => {
    // Triggered on move and click
    const handlePointer = (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Extract pixel index and don't proceed if its not valid
      const element = e.target as HTMLDivElement
      const extractedIndex = +(element.getAttribute('data-pixel-index') ?? NaN)
      if (Number.isNaN(extractedIndex)) return

      const pixel = canvas[extractedIndex]

      if (e.buttons === 1) {
        const paintingColor = mode === MODES.PAINT ? selectedColor : bgColor

        if (paintingColor !== pixel.color) {
          setCanvasPixel(extractedIndex, { ...pixel, color: paintingColor })
        }
      }
    }

    if (canvasRef.current) {
      canvasRef.current.addEventListener('pointermove', handlePointer)
      canvasRef.current.addEventListener('pointerdown', handlePointer)
    }

    return () => {
      canvasRef.current?.removeEventListener('pointermove', handlePointer)
      canvasRef.current?.removeEventListener('pointerdown', handlePointer)
    }
  }, [canvasRef.current, mode, selectedColor, bgColor])

  return { canvas, canvasRef }
}
