import { TOOLS } from '@consts'
import type { PaintPixelData } from '@types'
import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { useInterval } from './useInterval'
import { useTimeout } from './useTimeout'

export const usePaintCanvas = () => {
  const pixels = usePaintStore(s => s.pixels)
  const setPixels = usePaintStore(s => s.setPixels)
  const paintPixels = usePaintStore(s => s.paintPixels)

  const selectedColor = usePaintStore(s => s.color)
  const setSelectedColor = usePaintStore(s => s.setColor)

  const bgColor = usePaintStore(s => s.bgColor)
  const tool = usePaintStore(s => s.tool)
  const setTool = usePaintStore(s => s.setTool)

  const draft = useCanvasStore(s => s.draftCanvas)
  const hydrated = useCanvasStore(s => s.hydrated)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const usingSecondClickOnEraser = useRef(false)

  const lastUsedPaintTool = useRef(TOOLS.BRUSH)
  const toolsHistory = useRef<TOOLS[]>([])

  const colorPickerHoldingColor = useRef<string | null>(null)
  const { startInterval: startBucketInterval, stopInterval: stopBucketInterval } = useInterval()

  const isOnWheelTimeout = useRef(false)
  const { startTimeout: startWheelTimeout, stopTimeout: stopWheelTimeout } = useTimeout([], () => {
    isOnWheelTimeout.current = false
  })

  // Set up state refs
  const stateRefs = useRef({ pixels, tool, selectedColor, bgColor })
  useEffect(() => {
    stateRefs.current = { pixels, tool, selectedColor, bgColor }
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
    setEditingCanvasId(null)
    setPixels(draft.pixels)
  }, [hydrated])

  useEffect(() => {
    // Stop eraser behavior
    if (tool !== TOOLS.ERASER) {
      usingSecondClickOnEraser.current = false
    }

    // Handle tools history
    toolsHistory.current.push(tool)
    toolsHistory.current = toolsHistory.current.slice(-2)

    // Set last used paint tool
    if ([TOOLS.BRUSH, TOOLS.BUCKET].includes(tool)) {
      lastUsedPaintTool.current = tool
    }
  }, [tool])

  // Pointer event handlers
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
      if (usingSecondClickOnEraser.current) {
        // Handle ceasing the use of eraser, switching back to the last used tool
        const [lastUsedTool] = toolsHistory.current
        setTool(lastUsedTool ?? TOOLS.BRUSH)
      } else if (colorPickerHoldingColor.current) {
        // Handle ceasing the use of eraser, switching back to the last used paint tool
        setSelectedColor(colorPickerHoldingColor.current)
        colorPickerHoldingColor.current = null
        setTool(lastUsedPaintTool.current)
      }
    }

    // Triggered on move and click
    const handlePointer = (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Dont proceed if it wasn't a valid click
      const clickButton = e.buttons

      if (![1, 2, 4].includes(clickButton)) return

      // Extract pixel index and don't proceed if its not valid
      const element = e.target as HTMLDivElement
      const pixelIndex = +(element.getAttribute('data-pixel-index') ?? NaN)
      if (Number.isNaN(pixelIndex)) return

      const { pixels, tool, selectedColor } = stateRefs.current
      const pixelColor = structuredClone(pixels[pixelIndex])

      // Switch to the eraser automatically on right click
      if (tool !== TOOLS.ERASER && clickButton === 2) {
        erasePixel(pixelColor, pixelIndex)
        setTool(TOOLS.ERASER)
        usingSecondClickOnEraser.current = true
        return
      }

      if (clickButton === 4) {
        // Switch to the color picker automaticallly on middle click
        setTool(TOOLS.COLOR_PICKER)
        colorPickerHoldingColor.current = pixelColor
        return
      }

      switch (tool) {
        case TOOLS.ERASER: {
          erasePixel(pixelColor, pixelIndex)

          if (clickButton === 2) {
            usingSecondClickOnEraser.current = true
          }
          break
        }
        case TOOLS.BRUSH: {
          paintPixel(pixelColor, pixelIndex)
          break
        }
        case TOOLS.BUCKET: {
          if (colorComparison(pixelColor, selectedColor)) break

          const groupedGenerations = findBucketPixels({
            pixelsMap: pixels,
            startIndexes: [pixelIndex],
            zoneColor: pixelColor
          })

          if (!groupedGenerations.length) break

          // Paint per group
          const paintGeneration = (genIndex: number) => {
            paintPixels(...groupedGenerations[genIndex].map(({ index }) => ({ color: selectedColor, index })))
          }

          const maxPixelsForAnim = 33
          if (groupedGenerations.length < maxPixelsForAnim) {
            // Paint pixel groups with an interval
            const intervalTime = getBucketIntervalTime(groupedGenerations.length, maxPixelsForAnim)

            let currentGenIndex = 0
            paintGeneration(currentGenIndex)

            // Start the interval
            const intervalIndex = startBucketInterval(() => {
              if (++currentGenIndex < groupedGenerations.length) {
                paintGeneration(currentGenIndex)
                return
              }
              stopBucketInterval(intervalIndex)
            }, intervalTime)
          } else {
            // Instant paint pixel groups
            const paintPixelsData: PaintPixelData[] = []
            for (const generation of groupedGenerations) {
              paintPixelsData.push(...generation.map(({ index }) => ({ color: selectedColor, index })))
            }
            paintPixels(...paintPixelsData)
          }
          break
        }
        case TOOLS.COLOR_PICKER: {
          setSelectedColor(pixelColor)
          setTool(lastUsedPaintTool.current)
          break
        }
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', HandlePointerMove, { passive: false })
    document.addEventListener('pointerup', handlePointerUp, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', HandlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const paintPixel = (pixelColor: string, index: number) => {
    if (!colorComparison(pixelColor, stateRefs.current.selectedColor)) {
      paintPixels({ index, color: stateRefs.current.selectedColor })
    }
  }

  const erasePixel = (pixelColor: string, index: number) => {
    if (!colorComparison(pixelColor, stateRefs.current.bgColor)) {
      paintPixels({ index, color: stateRefs.current.bgColor })
    }
  }

  const getBucketIntervalTime = (pixelCount: number, maxPixels: number) => {
    const t = { min: 4, max: 70 }
    return t.min + (1 - pixelCount / maxPixels) * t.max - t.min
  }

  // Switch tools on mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (colorPickerHoldingColor.current || usingSecondClickOnEraser.current || isOnWheelTimeout.current) {
        return
      }
      const add = e.deltaY < 0 ? -1 : 1
      const selectedTool = +stateRefs.current.tool

      const toolsLength = Object.keys(TOOLS).filter(k => Number.isNaN(+k)).length

      let newSelectedTool = selectedTool + add
      if (newSelectedTool >= toolsLength) newSelectedTool = 1
      else if (newSelectedTool < 1) newSelectedTool = toolsLength - 1

      isOnWheelTimeout.current = true
      startWheelTimeout(stopWheelTimeout, 120)

      setTool(newSelectedTool)
    }

    document.addEventListener('wheel', handleWheel)
    return () => document.removeEventListener('wheel', handleWheel)
  }, [])

  return { pixels, canvasRef }
}
