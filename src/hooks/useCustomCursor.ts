import { useEffect, useRef, useState } from 'react'
import { HTML_IDS } from '@/consts'
import { usePaintStore } from '@/store/usePaintStore'
import { getSafeWinDoc } from '@/utils/getSafeWinDoc'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { useEvent } from './useEvent'
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

  useEvent(
    'pointermove',
    (e: PointerEvent) => {
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
    },
    { capture: true, target: getSafeWinDoc().window }
  )

  useEvent(
    'pointerdown',
    (e: PointerEvent) => {
      lastPointerDownWasCanvas.current = isAtPaintCanvas(e)
    },
    { capture: true, target: getSafeWinDoc().window }
  )

  useEvent(
    'pointerup',
    () => {
      isPreservingHoveringState.current = false
    },
    { capture: true, target: getSafeWinDoc().window }
  )

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
  const hideCursor = (e: Event) => {
    e.stopPropagation()
    setIsShowingCursor(false)
  }
  const showCusor = (e: Event) => {
    e.stopPropagation()
    setIsShowingCursor(true)
  }

  useEvent('pointerleave', hideCursor, { deps: [isShowingCursor] })
  useEvent('blur', hideCursor, { deps: [isShowingCursor], target: getSafeWinDoc().window })
  useEvent('pointerenter', showCusor, { deps: [isShowingCursor] })

  return { cursorsContainerRef, isShowingCursor, currentCursorIndex }
}
