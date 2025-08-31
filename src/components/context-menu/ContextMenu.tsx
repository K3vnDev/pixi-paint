'use client'

import { EVENTS, HTML_IDS, Z_INDEX } from '@consts'
import type { ContextMenuDetail } from '@types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useEvent } from '@/hooks/useEvent'
import { useMenuBase } from '@/hooks/useMenuBase'
import { MenuBase } from '../MenuBase'
import { Option } from './Option'

export const ContextMenu = () => {
  const elementRef = useRef<HTMLDialogElement>(null)
  const [menuData, setMenuData] = useState<ContextMenuDetail | null>(null)

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    closeOn: {
      distance: 300,
      leaveDocument: true,
      scroll: true
    },
    elementSelector: `#${HTML_IDS.CONTEXT_MENU}`,
    horizontal: false,
    hideWhen: menuData === null,
    events: {
      onCloseMenu: () => {
        document.dispatchEvent(new CustomEvent(EVENTS.CONTEXT_MENU_CLOSED))
      }
    }
  })

  useEvent('$open-context-menu', e => {
    const menuDetail: ContextMenuDetail = (e as CustomEvent).detail
    setMenuData(menuDetail)
  })
  useEvent('$close-context-menu', closeMenu)

  useEffect(() => {
    if (menuData?.options.length) {
      const { position } = menuData
      setTimeout(() => openMenu(position), 0)
    }
  }, [menuData])

  useEffect(() => {
    if (isOpen && !menuData?.options.length) closeMenu()
  }, [isOpen, menuData])

  const flexOrder = useMemo(() => {
    const { transformOrigin } = style
    return typeof transformOrigin === 'string' && transformOrigin.includes('bottom')
      ? 'flex-col-reverse'
      : 'flex-col'
  }, [style])

  return (
    <MenuBase
      className={`flex ${flexOrder} top-0 left-0 py-1 ${Z_INDEX.CONTEXT_MENU}`}
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
