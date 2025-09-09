'use client'

import { EVENTS, HTML_IDS, Z_INDEX } from '@consts'
import { useRef, useState } from 'react'
import { useEvent } from '@/hooks/useEvent'
import { useMenuBase } from '@/hooks/useMenuBase'
import type { DialogMenuDetail } from '@/types'
import { MenuBase } from '../MenuBase'

export const DialogMenu = () => {
  const elementRef = useRef<HTMLElement>(null)
  const [children, setChildren] = useState<React.ReactNode>()
  const menuId = useRef<string | null>(null)

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['center'],
    horizontal: false,
    closeOn: { leaveDocument: false },
    elementSelector: `#${HTML_IDS.DIALOG_MENU}`,
    events: {
      onCloseMenu: () => {
        document.dispatchEvent(new CustomEvent(EVENTS.DIALOG_MENU_CLOSED, { detail: menuId.current }))
        menuId.current = null
      }
    },
    defaultOriginGetter: () => {
      const { clientWidth, clientHeight } = document.documentElement
      return { x: clientWidth / 2, y: clientHeight / 2 }
    }
  })

  useEvent('$open-dialog-menu', (e: Event) => {
    const { detail } = e as CustomEvent<DialogMenuDetail>
    setChildren(detail.component)
    menuId.current = detail.id

    requestAnimationFrame(() => openMenu())
  })

  useEvent('$close-dialog-menu', closeMenu)

  const blackBGStyle = isOpen ? '' : 'opacity-0 pointer-events-none'

  return (
    <div
      className={`
        fixed w-dvw h-dvh top-0 left-0 ${Z_INDEX.DIALOG_MENU}
        bg-black/50 backdrop-blur-xs ${blackBGStyle} transition-opacity duration-200
      `}
    >
      <MenuBase
        id={HTML_IDS.DIALOG_MENU}
        style={style}
        className={`
          flex flex-col items-center gap-2 px-10 py-8 pb-5
          rounded-2xl ${Z_INDEX.DIALOG_MENU}
        `}
        isOpen={isOpen}
        ref={elementRef}
      >
        {children}
      </MenuBase>
    </div>
  )
}
