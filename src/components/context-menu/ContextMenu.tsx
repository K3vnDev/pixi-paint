'use client'

import { EVENTS, HTML_IDS, Z_INDEX } from '@consts'
import type { ContextMenuBuilder } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useMenuBase } from '@/hooks/useMenuBase'
import { MenuBase } from '../MenuBase'
import { Option } from './Option'

export const ContextMenu = () => {
  const elementRef = useRef<HTMLDialogElement>(null)
  const [menuData, setMenuData] = useState<ContextMenuBuilder | null>(null)

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    closeOn: {
      distance: 350,
      leaveDocument: true,
      scroll: true
    },
    elementSelector: `#${HTML_IDS.CONTEXT_MENU}`,
    horizontal: false,
    hideWhen: menuData === null,
    events: {
      onCloseMenu: () => {
        document.dispatchEvent(new Event(EVENTS.CONTEXT_MENU_CLOSED))
      }
    }
  })

  useEffect(() => {
    const handleOpenContextMenu = (e: Event) => {
      const menuBuilder: ContextMenuBuilder = (e as CustomEvent).detail
      setMenuData(menuBuilder)
    }

    document.addEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenContextMenu)
    document.addEventListener(EVENTS.CLOSE_CONTEXT_MENU, closeMenu)

    return () => {
      document.removeEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenContextMenu)
      document.removeEventListener(EVENTS.CLOSE_CONTEXT_MENU, closeMenu)
    }
  }, [])

  useEffect(() => {
    if (menuData) {
      const { position } = menuData
      setTimeout(() => openMenu(position), 0)
    }
  }, [menuData])

  useEffect(() => {
    if (isOpen && !menuData?.options.length) {
      closeMenu()
    }
  }, [isOpen, menuData])

  return (
    <MenuBase
      className={`top-0 left-0 py-1 ${Z_INDEX.CONTEXT_MENU}`}
      {...{ isOpen, style }}
      id={HTML_IDS.CONTEXT_MENU}
      ref={elementRef}
    >
      {menuData?.options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </MenuBase>
  )
}
