import type { ContextMenuBuilder, ContextMenuOption } from '@types'
import { useEffect } from 'react'
import { EVENTS } from '@/consts'

enum CLICK_MODE {
  LEFT,
  RIGHT,
  BOTH
}

interface Params {
  options: ContextMenuOption[]
  ref: React.RefObject<HTMLElement | null>
  clickMode?: CLICK_MODE
}

export const useContextMenu = ({ options, ref, clickMode = CLICK_MODE.RIGHT }: Params) => {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current) return
      const button = e.buttons

      if ([1, 2].includes(button) && (clickMode === CLICK_MODE.BOTH || button === clickMode + 1)) {
        openMenu(e.clientX, e.clientY)
      }
    }

    ref.current?.addEventListener('pointerdown', handlePointerDown, { capture: true })
    return () => ref.current?.addEventListener('pointerdown', handlePointerDown, { capture: true })
  }, [])

  const openMenu = (x: number, y: number) => {
    const builder: ContextMenuBuilder = {
      options,
      position: { x, y }
    }

    const event = new CustomEvent(EVENTS.CONTEXT_MENU, { detail: builder })
    document.dispatchEvent(event)
  }

  return { openMenu }
}
