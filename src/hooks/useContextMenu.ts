import type { ContextMenuBuilder, ContextMenuOption } from '@types'
import { useEffect, useState } from 'react'
import { CLICK_BUTTON, EVENTS } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useFreshRef } from './useFreshRef'

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
  const refs = useFreshRef({ options, showWhen })

  const [menuIsOpen, setMenuIsOpen] = useState(false)

  // Listen and handle pointer
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      setTimeout(() => {
        if (!ref.current) return
        const clickBtn = e.button

        if (clickIncludes(clickBtn, ...allowedClicks)) {
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
      ref.current?.removeEventListener('pointerup', handlePointerDown)
      document.removeEventListener(EVENTS.CONTEXT_MENU_CLOSED, handleContextMenuClosed)
      closeMenu()
    }
  }, [])

  const openMenu = (x: number, y: number) => {
    const { options, showWhen } = refs.current
    if (!options.length || !showWhen) return

    const builder: ContextMenuBuilder = {
      options,
      position: { x, y },
      allowedClicks
    }

    const event = new CustomEvent(EVENTS.OPEN_CONTEXT_MENU, { detail: builder })
    document.dispatchEvent(event)
    setMenuIsOpen(true)
  }

  const closeMenu = () => {
    const event = new CustomEvent(EVENTS.CLOSE_CONTEXT_MENU)
    document.dispatchEvent(event)
  }

  return { openMenu, menuIsOpen }
}
