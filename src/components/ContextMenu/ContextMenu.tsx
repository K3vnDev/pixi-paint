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

  const { isOpen, openMenu, closeMenu, animation, position } = useMenuBase({
    elementRef,
    closeOn: {
      distance: 350,
      leaveDocument: true,
      scroll: true
    },
    elementSelector: `#${HTML_IDS.CONTEXT_MENU}`,
    horizontal: false,
    events: {
      onCloseMenu: () => {
        document.dispatchEvent(new Event(EVENTS.CONTEXT_MENU_CLOSED))
      },
      afterCloseMenuAnim: () => {
        setMenuData(null)
      }
    }
  })

  useEffect(() => {
    const handleOpenContextMenu = (e: Event) => {
      const menuBuilder: ContextMenuBuilder = (e as CustomEvent).detail
      setMenuData(menuBuilder)
      openMenu(menuBuilder.position)
    }

    document.addEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenContextMenu)
    document.addEventListener(EVENTS.CLOSE_CONTEXT_MENU, closeMenu)

    return () => {
      document.removeEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenContextMenu)
      document.removeEventListener(EVENTS.CLOSE_CONTEXT_MENU, closeMenu)
    }
  }, [])

  return (
    <MenuBase
      className={`
        top-0 left-0 py-1 origin-top-left ${Z_INDEX.CONTEXT_MENU}
      `}
      {...{ isOpen, animation, position }}
      id={HTML_IDS.CONTEXT_MENU}
      ref={elementRef}
    >
      {menuData?.options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </MenuBase>
  )
}
