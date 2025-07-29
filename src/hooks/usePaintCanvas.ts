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
  const setTool = usePaintStore(s => s.setTool)

  const draft = useCanvasStore(s => s.draft)
  const hydrated = useCanvasStore(s => s.hydrated)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const usedSecondClickOnEraser = useRef(false)

  // Set up pointer refs
  const pointerRefs = useRef({ pixels, tool, selectedColor, bgColor })
  useEffect(() => {
    pointerRefs.current = { pixels, tool, selectedColor, bgColor }
  }, [pixels, tool, selectedColor, bgColor])

  // Load the correct painting on startup
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
    if (tool !== TOOLS.ERASER) {
      usedSecondClickOnEraser.current = false
    }
  }, [tool])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handlePointerDown = (e: PointerEvent) => {
      handlePointer(e)
    }

    const HandlePointerMove = (e: PointerEvent) => {
      handlePointer(e)
    }

    const handlePointerUp = () => {
      // Switch to brush after using second click on eraser
      if (usedSecondClickOnEraser.current) {
        setTool(TOOLS.BRUSH)
      }
    }

    // Triggered on move and click
    const handlePointer = (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Dont proceed if it wasn't a valid click
      const clickButton = e.buttons
      if (![1, 2].includes(clickButton)) return

      // Extract pixel index and don't proceed if its not valid
      const element = e.target as HTMLDivElement
      const pixelIndex = +(element.getAttribute('data-pixel-index') ?? NaN)
      if (Number.isNaN(pixelIndex)) return

      const { pixels, tool, selectedColor } = pointerRefs.current
      const pixelColor = structuredClone(pixels[pixelIndex])

      switch (tool) {
        case TOOLS.ERASER: {
          erasePixel(pixelColor, pixelIndex)

          if (clickButton === 2) {
            usedSecondClickOnEraser.current = true
          }
          break
        }
        case TOOLS.BRUSH: {
          if (clickButton === 1) {
            paintPixel(pixelColor, pixelIndex)
          } else {
            erasePixel(pixelColor, pixelIndex)
            setTool(TOOLS.ERASER)
            usedSecondClickOnEraser.current = true
          }
          break
        }
        case TOOLS.BUCKET: {
          if (clickButton !== 1 || colorComparison(pixelColor, selectedColor)) break

          const newPixels = structuredClone(pixels)
          const indexes = getBucketPixels(newPixels, pixelIndex, pixelColor)

          for (const index of indexes) {
            newPixels[index] = selectedColor
          }
          setPixels(newPixels)
          break
        }
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', HandlePointerMove, { passive: false })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', HandlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const paintPixel = (pixelColor: string, index: number) => {
    if (!colorComparison(pixelColor, selectedColor)) {
      setPixelsPixel(index, selectedColor)
    }
  }

  const erasePixel = (pixelColor: string, index: number) => {
    if (!colorComparison(pixelColor, bgColor)) {
      setPixelsPixel(index, bgColor)
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

  return { pixels, canvasRef, showTool: tool }
}
