import type { ContextMenuDetail, ContextMenuOption } from '@types'
import { useEffect, useRef, useState } from 'react'
import { CLICK_BUTTON, EVENTS } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useFreshRefs } from './useFreshRefs'
import { useTimeout } from './useTimeout'

interface Params {
  options: ContextMenuOption[]
  ref: React.RefObject<HTMLElement | null>
  allowedClicks?: CLICK_BUTTON[]
  showWhen?: boolean
}

export const useContextMenu = ({
  options,
  ref,
  allowedClicks = [CLICK_BUTTON.RIGHT],
  showWhen = true
}: Params) => {
  const OPEN_WAIT = 50
  const refs = useFreshRefs({ options, showWhen })
  const { startTimeout, stopTimeout } = useTimeout()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const isOpeningMenu = useRef(false)

  // Listen and handle pointer
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (isOpeningMenu.current) return
      stopTimeout()
      isOpeningMenu.current = true

      startTimeout(() => {
        isOpeningMenu.current = false

        if (ref.current && clickIncludes(e.button, ...allowedClicks)) {
          openMenu(e.clientX, e.clientY)
        }
      }, OPEN_WAIT)
    }

    const handleContextMenuClosed = () => {
      setMenuIsOpen(false)
    }

    ref.current?.addEventListener('pointerup', handlePointerDown, { capture: true })
    document.addEventListener(EVENTS.CONTEXT_MENU_CLOSED, handleContextMenuClosed)

    return () => {
      ref.current?.removeEventListener('pointerup', handlePointerDown, { capture: true })
      document.removeEventListener(EVENTS.CONTEXT_MENU_CLOSED, handleContextMenuClosed)
      closeMenu()
    }
  }, [])

  const openMenu = (x: number, y: number) => {
    const { options, showWhen } = refs.current
    if (!options.length || !showWhen) return

    const detail: ContextMenuDetail = {
      options,
      position: { x, y },
      allowedClicks
    }

    const event = new CustomEvent(EVENTS.OPEN_CONTEXT_MENU, { detail })
    document.dispatchEvent(event)
    setMenuIsOpen(true)
  }

  const closeMenu = () => {
    const event = new CustomEvent(EVENTS.CLOSE_CONTEXT_MENU)
    document.dispatchEvent(event)
  }

  return { openMenu, menuIsOpen }
}
