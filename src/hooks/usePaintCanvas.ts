import { CANVAS_RESOLUTION, CLICK_BUTTON as CB, EVENTS, TOOLS, WHEEL_SWITCH_TOOL_COOLDOWN } from '@consts'
import { useEffect, useRef } from 'react'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { usePaintStore } from '@/store/usePaintStore'
import { clickIncludes } from '@/utils/clickIncludes'
import { colorComparison } from '@/utils/colorComparison'
import { useTimeout } from './timer-handlers/useTimeout'
import { useBucketPixels } from './useBucketPixels'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'
import { useTouchChecking } from './useTouchChecking'

export const usePaintCanvas = () => {
  const pixels = usePaintStore(s => s.pixels)
  const setPixels = usePaintStore(s => s.setPixels)
  const paintPixels = usePaintStore(s => s.paintPixels)

  const selectedColor = usePaintStore(s => s.primaryColor)
  const setSelectedColor = usePaintStore(s => s.setPrimaryColor)

  const secondaryColor = usePaintStore(s => s.secondaryColor)
  const tool = usePaintStore(s => s.tool)
  const setTool = usePaintStore(s => s.setTool)

  const draft = useCanvasesStore(s => s.draftCanvas)
  const hydrated = useCanvasesStore(s => s.hydrated)
  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)

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
  const isUsingTouch = useTouchChecking()

  // Set up state refs
  const stateRefs = useFreshRefs({
    pixels,
    tool,
    selectedColor,
    secondaryColor,
    savedCanvases,
    draft,
    isUsingTouch
  })

  // Load the correct painting on startup
  useEffect(() => {
    if (!hydrated) return
    const { draft, savedCanvases } = stateRefs.current

    // Check if the user left an open canvas
    if (editingCanvasId) {
      const foundCanvas = savedCanvases.find(c => c.id === editingCanvasId)

      if (foundCanvas) {
        setPixels(foundCanvas.pixels)
        return
      }
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

  // Triggered on move and click
  const handlePointer = (e: PointerEvent | TouchEvent) => {
    const { pixels, tool, selectedColor, isUsingTouch } = stateRefs.current

    // Dont proceed if it wasn't a valid click
    const clickBtn = clickButton.current
    if ((!clickIncludes(clickBtn, CB.LEFT, CB.RIGHT, CB.MIDDLE) && !isUsingTouch) || !canvasRef.current) {
      return
    }

    // Extract pixel index and don't proceed if its not valid
    const pixelIndex = extractPixelIndex(e)
    if (pixelIndex === -1) return

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
        dispatchPaintedEvent()

        paintBucketPixels({
          autoIntervalTime: true,
          startIndexes: [pixelIndex],
          zoneColor: pixelColor,
          paintGenerationAction: gen => {
            paintPixels(...gen.map(({ index }) => ({ color: selectedColor, index })))
          }
        })
        break
      }
      case TOOLS.COLOR_PICKER: {
        setSelectedColor(pixelColor)
        setTool(lastUsedPaintTool.current)
        break
      }
    }
  }

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

  useEvent('touchmove', handlePointer)
  useEvent('touchstart', handlePointer)
  useEvent('touchend', handlePointerStop)

  useEvent('pointerup', handlePointerStop, { passive: false })
  useEvent('pointerleave', handlePointerStop, { passive: false })
  useEvent('pointermove', handlePointer, { passive: false })

  useEvent(
    'pointerdown',
    (e: PointerEvent) => {
      clickButton.current = e.button
      handlePointer(e)
    },
    { passive: false }
  )

  const paintPixel = (pixelColor: string, index: number) => {
    const { selectedColor } = stateRefs.current
    if (!colorComparison(pixelColor, selectedColor)) {
      paintPixels({ index, color: selectedColor })
      dispatchPaintedEvent()
    }
  }

  const erasePixel = (pixelColor: string, index: number) => {
    const { secondaryColor } = stateRefs.current
    if (!colorComparison(pixelColor, secondaryColor)) {
      paintPixels({ index, color: secondaryColor })
      dispatchPaintedEvent()
    }
  }

  const extractPixelIndex = (e: PointerEvent | TouchEvent): number => {
    if (!canvasRef.current) return -1

    // Get variables
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
    const { height: canvasSize, left, top } = canvasRef.current.getBoundingClientRect()

    // Get cordinates
    const coordinate = (raw: number) => Math.floor((raw / canvasSize) * CANVAS_RESOLUTION)
    const [x, y] = [coordinate(clientX - left), coordinate(clientY - top)]

    if ([x, y].some(v => !Number.isNaN(v) && (v < 0 || v > CANVAS_RESOLUTION - 1))) {
      return -1
    }

    // Return coordinates translated to index
    return y * CANVAS_RESOLUTION + x
  }

  useEvent('$select-last-paint-tool', () => {
    setTool(lastUsedPaintTool.current)
  })

  // Switch tools on mouse wheel
  useEvent('wheel', (e: WheelEvent) => {
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
  })

  const dispatchPaintedEvent = () => {
    document.dispatchEvent(new Event(EVENTS.PAINTED))
  }

  return { pixels, canvasRef }
}
