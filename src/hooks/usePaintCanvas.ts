import { TOOLS } from '@consts'
import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'

export const usePaintCanvas = () => {
  const pixels = usePaintStore(s => s.pixels)
  const setPixels = usePaintStore(s => s.setPixels)

  const setPixelsPixel = usePaintStore(s => s.setPixelsPixel)
  const selectedColor = usePaintStore(s => s.color)
  const bgColor = usePaintStore(s => s.bgColor)
  const tool = usePaintStore(s => s.tool)

  const draft = useCanvasStore(s => s.draft)
  const hydrated = useCanvasStore(s => s.hydrated)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)

  const canvasRef = useRef<HTMLDivElement | null>(null)

  const pixelsRef = useRef(pixels)
  useEffect(() => {
    pixelsRef.current = pixels
  }, [pixels])

  useEffect(() => {
    if (!hydrated) return

    // Check if the user left an open canvas
    const foundCanvas = savedCanvases.find(c => c.id === editingCanvasId)
    if (foundCanvas) {
      setPixels(foundCanvas.pixels)
      return
    }

    // If not, load draft
    setPixels(draft.pixels)
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

      const pixel = structuredClone(pixelsRef.current[extractedIndex])
      const clickButton = e.buttons

      let newColor: null | string = null

      if ((clickButton === 2 && tool === TOOLS.BRUSH) || (clickButton === 1 && tool === TOOLS.ERASER)) {
        // Handle erase
        newColor = bgColor
      } else if (clickButton === 1 && tool === TOOLS.BRUSH) {
        // Paint
        newColor = selectedColor
      }

      if (newColor) {
        const color = newColor.toLowerCase()
        if (color !== pixel.color.toLowerCase()) {
          setPixelsPixel(extractedIndex, { ...pixel, color })
        }
      }
    }

    if (canvasRef.current) {
      canvasRef.current.addEventListener('pointermove', handlePointer, { passive: false })
      canvasRef.current.addEventListener('pointerdown', handlePointer, { passive: false })
    }

    return () => {
      canvasRef.current?.removeEventListener('pointermove', handlePointer)
      canvasRef.current?.removeEventListener('pointerdown', handlePointer)
    }
  }, [canvasRef.current, tool, selectedColor, bgColor])

  return { pixels, canvasRef }
}
