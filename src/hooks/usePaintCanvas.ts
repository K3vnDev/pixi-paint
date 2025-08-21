import { CLICK_BUTTON as CB, TOOLS, WHEEL_SWITCH_TOOL_COOLDOWN } from '@consts'
import type { PaintPixelData } from '@types'
import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { clickIncludes } from '@/utils/clickIncludes'
import { colorComparison } from '@/utils/colorComparison'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { useBucketPixels } from './useBucketPixels'
import { useFreshRefs } from './useFreshRefs'
import { useTimeout } from './useTimeout'

export const usePaintCanvas = () => {
  const pixels = usePaintStore(s => s.pixels)
  const setPixels = usePaintStore(s => s.setPixels)
  const paintPixels = usePaintStore(s => s.paintPixels)

  const selectedColor = usePaintStore(s => s.primaryColor)
  const setSelectedColor = usePaintStore(s => s.setPrimaryColor)

  const secondaryColor = usePaintStore(s => s.secondaryColor)
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
  const { paintBucketPixels } = useBucketPixels()

  const isOnWheelTimeout = useRef(false)
  const { startTimeout: startWheelTimeout, stopTimeout: stopWheelTimeout } = useTimeout([], () => {
    isOnWheelTimeout.current = false
  })

  const clickButton = useRef(-1)

  // Set up state refs
  const stateRefs = useFreshRefs({ pixels, tool, selectedColor, secondaryColor })

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
      clickButton.current = e.button
      handlePointer(e)
    }

    const HandlePointerMove = (e: PointerEvent) => handlePointer(e)

    const handlePointerStop = () => {
      clickButton.current = -1

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
      const clickBtn = clickButton.current
      if (!clickIncludes(clickBtn, CB.LEFT, CB.RIGHT, CB.MIDDLE)) return

      // Extract pixel index and don't proceed if its not valid
      const element = e.target as HTMLDivElement
      const pixelIndex = +(element.getAttribute('data-pixel-index') ?? NaN)
      if (Number.isNaN(pixelIndex)) return

      const { pixels, tool, selectedColor } = stateRefs.current
      const pixelColor = structuredClone(pixels[pixelIndex])

      // Switch to the eraser automatically on right click
      if (tool !== TOOLS.ERASER && clickIncludes(clickBtn, CB.RIGHT)) {
        erasePixel(pixelColor, pixelIndex)
        setTool(TOOLS.ERASER)
        usingSecondClickOnEraser.current = true
        return
      }

      if (clickIncludes(clickBtn, CB.MIDDLE)) {
        // Switch to the color picker automaticallly on middle click
        setTool(TOOLS.COLOR_PICKER)
        colorPickerHoldingColor.current = pixelColor
        return
      }

      switch (tool) {
        case TOOLS.ERASER: {
          erasePixel(pixelColor, pixelIndex)

          if (clickIncludes(clickBtn, CB.RIGHT)) {
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

          // TODO: Delete this fuction, the hook should take care of everything
          const groupedGenerations = findBucketPixels({
            pixelsMap: pixels, // Get from hook
            startIndexes: [pixelIndex], // Keep
            zoneColor: pixelColor // Keep
          })

          // Don't proceed if there are no generations
          if (groupedGenerations.length === 0) break

          const maxPixelsForAnim = 33
          if (groupedGenerations.length < maxPixelsForAnim) {
            // Paint pixel groups with an interval
            const intervalTime = getBucketIntervalTime(groupedGenerations.length, maxPixelsForAnim)

            paintBucketPixels({
              groupedGens: groupedGenerations,
              intervalTime,
              paintGenAction: currentGeneration => {
                paintPixels(...currentGeneration.map(({ index }) => ({ color: selectedColor, index })))
              }
            })
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
    document.addEventListener('pointerup', handlePointerStop, { passive: false })
    document.addEventListener('pointerleave', handlePointerStop, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', HandlePointerMove)
      document.removeEventListener('pointerup', handlePointerStop)
      document.removeEventListener('pointerleave', handlePointerStop)
    }
  }, [])

  const paintPixel = (pixelColor: string, index: number) => {
    const { selectedColor } = stateRefs.current
    if (!colorComparison(pixelColor, selectedColor)) {
      paintPixels({ index, color: selectedColor })
    }
  }

  const erasePixel = (pixelColor: string, index: number) => {
    const { secondaryColor } = stateRefs.current
    if (!colorComparison(pixelColor, secondaryColor)) {
      paintPixels({ index, color: secondaryColor })
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
      startWheelTimeout(stopWheelTimeout, WHEEL_SWITCH_TOOL_COOLDOWN)

      setTool(newSelectedTool)
    }

    document.addEventListener('wheel', handleWheel)
    return () => document.removeEventListener('wheel', handleWheel)
  }, [])

  return { pixels, canvasRef }
}
