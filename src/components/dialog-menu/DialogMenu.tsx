'use client'

import { EVENTS, HTML_IDS, Z_INDEX } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { useMenuBase } from '@/hooks/useMenuBase'
import { MenuBase } from '../MenuBase'

export const DialogMenu = () => {
  const elementRef = useRef<HTMLElement>(null)
  const [children, setChildren] = useState<React.ReactNode>()

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['center'],
    closeOn: { leaveDocument: false },
    elementSelector: `#${HTML_IDS.DIALOG_MENU}`,
    defaultOriginGetter: () => {
      const { clientWidth, clientHeight } = document.documentElement
      return { x: clientWidth / 2, y: clientHeight / 2 }
    }
  })

  useEffect(() => {
    const handleOpenDialogMenu = (e: Event) => {
      const { detail } = e as CustomEvent
      setChildren(detail)
      requestAnimationFrame(() => openMenu())
    }

    document.addEventListener(EVENTS.OPEN_DIALOG_MENU, handleOpenDialogMenu)
    document.addEventListener(EVENTS.CLOSE_DIALOG_MENU, closeMenu)

    return () => {
      document.removeEventListener(EVENTS.OPEN_DIALOG_MENU, handleOpenDialogMenu)
      document.removeEventListener(EVENTS.CLOSE_DIALOG_MENU, closeMenu)
    }
  }, [])

  const blackBGStyle = isOpen ? '' : 'opacity-0 pointer-events-none'

  return (
    <div
      className={`
        absolute w-dvw h-dvh top-0 left-0 ${Z_INDEX.DIALOG_MENU}
        bg-black/40 backdrop-blur-[2px] ${blackBGStyle} transition-opacity duration-200
      `}
    >
      <MenuBase
        id={HTML_IDS.DIALOG_MENU}
        style={style}
        className={`
          flex flex-col items-center gap-2 px-10 py-8 max-w-xl
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
