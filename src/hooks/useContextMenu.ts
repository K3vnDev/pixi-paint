import type { ContextMenuDetail, ContextMenuOption } from '@types'
import { useEffect, useRef, useState } from 'react'
import { CLICK_BUTTON, EVENTS } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'
import { useTimeout } from './useTimeout'

interface Params {
  options: ContextMenuOption[]
  ref: React.RefObject<HTMLElement | null>
  allowedClicks?: Array<CLICK_BUTTON.LEFT | CLICK_BUTTON.RIGHT>
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
  useEvent(
    'pointerup',
    (e: PointerEvent) => {
      if (isOpeningMenu.current) return
      stopTimeout()
      isOpeningMenu.current = true

      startTimeout(() => {
        isOpeningMenu.current = false

        if (ref.current && clickIncludes(e.button, ...allowedClicks)) {
          openMenu(e.clientX, e.clientY)
        }
      }, OPEN_WAIT)
    },
    { target: ref, capture: true, deps: [showWhen] }
  )

  useEvent('$context-menu-closed', () => {
    setMenuIsOpen(false)
  })

  // Close menu on un-mount
  useEffect(() => closeMenu, [])

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
