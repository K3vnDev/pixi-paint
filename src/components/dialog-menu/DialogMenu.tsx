'use client'

import { EVENTS, Z_INDEX } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { useMenuBase } from '@/hooks/useMenuBase'
import { MenuBase } from '../MenuBase'

export const DialogMenu = () => {
  const elementRef = useRef<HTMLElement>(null)
  const [children, setChildren] = useState<React.ReactNode>(null)

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['center'],
    closeOn: { leaveDocument: false }
  })

  useEffect(() => {
    const handleShowDialogMenu = (e: Event) => {
      const { detail } = e as CustomEvent

      setChildren(detail)
      requestAnimationFrame(() => {
        const { clientWidth, clientHeight } = document.documentElement
        openMenu({ x: clientWidth / 2, y: clientHeight / 2 })
      })
    }

    document.addEventListener(EVENTS.OPEN_DIALOG_MENU, handleShowDialogMenu)
    return () => document.removeEventListener(EVENTS.OPEN_DIALOG_MENU, handleShowDialogMenu)
  }, [])

  const blackBGStyle = isOpen ? '' : 'opacity-0 pointer-events-none'

  return (
    <div
      className={`
        absolute w-dvw h-dvh top-0 left-0 ${Z_INDEX.DIALOG_MENU}
        bg-black/35 backdrop-blur-[2px] ${blackBGStyle} transition-all duration-200
      `}
      onClick={closeMenu}
    >
      <MenuBase style={style} className={`${Z_INDEX.DIALOG_MENU}`} isOpen={isOpen} ref={elementRef}>
        {children}
      </MenuBase>
    </div>
  )
}
