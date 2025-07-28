import { PIXEL_ART_RES, TOOLS } from '@consts'
import type { BucketPixel } from '@types'
import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'

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

  const pointerRefs = useRef({ pixels, tool, selectedColor, bgColor })
  useEffect(() => {
    pointerRefs.current = { pixels, tool, selectedColor, bgColor }
  }, [pixels, tool, selectedColor, bgColor])

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
    const canvas = canvasRef.current
    if (!canvas) return

    // Triggered on move and click
    const handlePointer = (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Extract pixel index and don't proceed if its not valid
      const element = e.target as HTMLDivElement
      const pixelIndex = +(element.getAttribute('data-pixel-index') ?? NaN)
      if (Number.isNaN(pixelIndex)) return

      const { pixels, bgColor, tool, selectedColor } = pointerRefs.current

      const pixelColor = structuredClone(pixels[pixelIndex])
      const clickButton = e.buttons

      if ((clickButton === 2 && tool === TOOLS.BRUSH) || (clickButton === 1 && tool === TOOLS.ERASER)) {
        // Handle erase
        paintPixel(pixelColor, bgColor, pixelIndex)
        console.log('Erasing...', { tool, pixelIndex, pixelColor, bgColor })
      } else if (clickButton === 1 && tool === TOOLS.BRUSH) {
        // Handle brush
        paintPixel(pixelColor, selectedColor, pixelIndex)
        console.log('Brush painting...', { tool, pixelIndex, pixelColor, selectedColor })
      } else if (clickButton === 1 && tool === TOOLS.BUCKET && !colorComparison(pixelColor, selectedColor)) {
        // Handle bucket
        const newPixels = structuredClone(pixels)
        const indexes = getBucketPixels(newPixels, pixelIndex, pixelColor)

        console.log(`Bucket painting ${indexes.length} pixels...`, { tool, pixelIndex, pixelColor })

        for (const index of indexes) {
          newPixels[index] = selectedColor
        }
        setPixels(newPixels)
      }
    }

    canvas.addEventListener('pointermove', handlePointer, { passive: false })
    canvas.addEventListener('pointerdown', handlePointer, { passive: false })

    return () => {
      canvas.removeEventListener('pointermove', handlePointer)
      canvas.removeEventListener('pointerdown', handlePointer)
    }
  }, [])

  const paintPixel = (pixelColor: string, color: string, index: number) => {
    if (!colorComparison(pixelColor, color)) {
      setPixelsPixel(index, color)
    }
  }

  const getBucketPixels = (originalPixels: string[], startIndex: number, zoneColor: string) => {
    const bucketMap: BucketPixel[] = originalPixels.map((pixelColor, index) => ({
      color: pixelColor,
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

  return { pixels, canvasRef }
}
