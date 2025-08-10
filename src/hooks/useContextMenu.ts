import type { ContextMenuBuilder, ContextMenuOption } from '@types'
import { useEffect } from 'react'
import { CLICK_BUTTON, EVENTS } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'

interface Params {
  options: ContextMenuOption[]
  ref: React.RefObject<HTMLElement | null>
  allowedClicks?: CLICK_BUTTON[]
}

export const useContextMenu = ({ options, ref, allowedClicks = [CLICK_BUTTON.RIGHT] }: Params) => {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current) return
      const clickBtn = e.buttons

      if (clickIncludes(clickBtn, ...allowedClicks)) {
        openMenu(e.clientX, e.clientY)
      }
    }

    ref.current?.addEventListener('pointerdown', handlePointerDown, { capture: true })
    return () => ref.current?.addEventListener('pointerdown', handlePointerDown, { capture: true })
  }, [])

  const openMenu = (x: number, y: number) => {
    const builder: ContextMenuBuilder = {
      options,
      position: { x, y },
      allowedClicks
    }

    const event = new CustomEvent(EVENTS.CONTEXT_MENU, { detail: builder })
    document.dispatchEvent(event)
  }

  return { openMenu }
}
