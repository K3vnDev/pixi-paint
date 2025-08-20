import { useEffect, useRef, useState } from 'react'
import { HTML_IDS } from '@/consts'
import { usePaintStore } from '@/store/usePaintStore'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { useFreshRefs } from './useFreshRefs'

export const useCustomCursor = () => {
  const cursorsContainerRef = useRef<HTMLDivElement | null>(null)

  const tool = usePaintStore(s => s.tool)
  const toolRef = useFreshRefs(tool)

  const isHoveringPaintCanvas = useRef(false)
  const lastPointerDownWasCanvas = useRef(false)
  const isPreservingHoveringState = useRef(false)

  const pointerPosition = useRef({ x: 0, y: 0 })
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0)

  const [isShowingCursor, setIsShowingCursor] = useState(false)

  // Tool main movement
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Check if its hovering paint canvas and preseve its state when moving out while holding the button
      const newIsHoveingPaintCanvas = isAtPaintCanvas(e)
      if (
        !newIsHoveingPaintCanvas &&
        isHoveringPaintCanvas.current &&
        lastPointerDownWasCanvas.current &&
        e.buttons
      ) {
        isPreservingHoveringState.current = true
      }
      isHoveringPaintCanvas.current = isPreservingHoveringState.current || newIsHoveingPaintCanvas

      // Refresh pointer position and cursor
      pointerPosition.current = { x: e.clientX, y: e.clientY }
      refreshCursor()
      setIsShowingCursor(true)
    }

    const handlePointerUp = () => {
      isPreservingHoveringState.current = false
    }

    const handlePointerDown = (e: PointerEvent) => {
      lastPointerDownWasCanvas.current = isAtPaintCanvas(e)
    }

    window.addEventListener('pointermove', handlePointerMove, { capture: true })
    window.addEventListener('pointerdown', handlePointerDown, { capture: true })
    window.addEventListener('pointerup', handlePointerUp, { capture: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true })
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true })
      window.removeEventListener('pointerup', handlePointerUp, { capture: true })
    }
  }, [])

  const isAtPaintCanvas = (e: PointerEvent) => wasInsideElement(e.target).id(HTML_IDS.PAINT_CANVAS)

  const refreshCursor = () => {
    if (!cursorsContainerRef.current) return

    const newCursorIndex = isHoveringPaintCanvas.current ? +toolRef.current : 0
    const { x: clientX, y: clientY } = pointerPosition.current

    for (const el of cursorsContainerRef.current.childNodes) {
      ;(el as HTMLDivElement).style.transform = `translate(${clientX}px, ${clientY}px)`
    }
    setCurrentCursorIndex(newCursorIndex)
  }

  // Refresh cursor on tool change
  useEffect(refreshCursor, [tool])

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

  return { cursorsContainerRef, isShowingCursor, currentCursorIndex }
}
