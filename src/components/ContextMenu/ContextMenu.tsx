'use client'

import { EVENTS, Z_INDEX } from '@consts'
import type { ContextMenuBuilder } from '@types'
import { useEffect, useRef, useState } from 'react'
import { Option } from './Option'

export const ContextMenu = () => {
  const isOpen = useRef(false)
  const isClosing = useRef(false)

  const [menuData, setMenuData] = useState<ContextMenuBuilder | null>(null)

  useEffect(() => {
    const handleOpenMenu = (e: Event) => {
      const menuBuilder: ContextMenuBuilder = (e as CustomEvent).detail

      isOpen.current = true
      setMenuData(menuBuilder)
    }

    const handlePointerMove = (_: PointerEvent) => {}
    const handlePointerDown = (_: PointerEvent) => {}

    document.addEventListener('pointermove', handlePointerMove, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    document.addEventListener(EVENTS.CONTEXT_MENU, handleOpenMenu)
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener(EVENTS.CONTEXT_MENU, handleOpenMenu)
    }
  }, [])

  const closeMenu = () => {}

  if (!menuData) return null
  const { options, position } = menuData

  return (
    <dialog
      className={`
        absolute top-0 left-0 ${Z_INDEX.CONTEXT_MENU}
        bg-theme-50 border-2 border-theme-20 py-1 rounded-xl
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      open
    >
      {options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </dialog>
  )
}
