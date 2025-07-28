import { PIXEL_ART_RES, TOOLS } from '@consts'
import type { BucketPixel, Pixel } from '@types'
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

      if ((clickButton === 2 && tool === TOOLS.BRUSH) || (clickButton === 1 && tool === TOOLS.ERASER)) {
        // Handle erase
        paintPixel(pixel, bgColor, extractedIndex)
      } else if (clickButton === 1 && tool === TOOLS.BRUSH) {
        // Paint
        paintPixel(pixel, selectedColor, extractedIndex)
      } else if (clickButton === 1 && tool === TOOLS.BUCKET && !colorComparison(pixel.color, selectedColor)) {
        // Handle bucket
        const newPixels = structuredClone(pixelsRef.current)
        const indexes = getBucketPixels(newPixels, extractedIndex, pixel.color)

        for (const index of indexes) {
          newPixels[index] = {
            ...newPixels[index],
            color: selectedColor
          }
        }
        setPixels(newPixels)
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

  const paintPixel = (pixel: Pixel, color: string, index: number) => {
    if (!colorComparison(pixel.color, color)) {
      setPixelsPixel(index, { ...pixel, color })
    }
  }

  const getBucketPixels = (originalPixels: Pixel[], startIndex: number, zoneColor: string) => {
    const bucketMap: BucketPixel[] = originalPixels.map(({ color }, index) => ({
      color,
      index,
      painted: false
    }))

    const handlePixel = (bucketPixel: BucketPixel) => {
      const { index, color: pixelColor, painted } = bucketPixel

      // If the color doesn't match or it was already painted, exit
      if (!colorComparison(pixelColor, zoneColor) || painted) {
        return
      }

      // Do paint
      bucketMap[index].painted = true
      paintIndexes.push(index)

      // Handle neighbours
      const rest = index % PIXEL_ART_RES

      const up = index - PIXEL_ART_RES >= 0 ? index - PIXEL_ART_RES : null
      const right = rest === PIXEL_ART_RES - 1 ? null : index + 1
      const down = index + PIXEL_ART_RES < PIXEL_ART_RES ** 2 ? index + PIXEL_ART_RES : null
      const left = rest === 0 ? null : index - 1

      for (const neighbour of [up, right, down, left]) {
        if (neighbour !== null) handlePixel(bucketMap[neighbour])
      }
    }

    const paintIndexes: number[] = []
    handlePixel(bucketMap[startIndex])

    return paintIndexes
  }

  // THIS IS TEMPORARY
  const colorComparison = (a: string, b: string) => {
    return a.toLowerCase() === b.toLowerCase()
  }

  return { pixels, canvasRef }
}
