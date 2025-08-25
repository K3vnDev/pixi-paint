'use client'

import { EVENTS, Z_INDEX } from '@consts'
import { useEffect, useRef, useState } from 'react'
import { useMenuBase } from '@/hooks/useMenuBase'
import { MenuBase } from '../MenuBase'
import { DMButton } from './DMButton'
import { DMHeader } from './DMHeader'
import { DMParagraph } from './DMParagraph'
import { DMZoneButtons } from './DMZoneButtons'

export const DialogMenu = () => {
  const elementRef = useRef<HTMLElement>(null)
  const [children, setChildren] = useState<React.ReactNode>(
    <>
      <DMHeader icon='trash'>Delete painting?</DMHeader>
      <DMParagraph>
        Do you really want to delete your painting? You wont see it again (a long time).
      </DMParagraph>
      <DMZoneButtons>
        <DMButton icon='trash' empty>
          Yes, I don't care
        </DMButton>
        <DMButton>No, wait!</DMButton>
      </DMZoneButtons>
    </>
  )

  const { isOpen, openMenu, closeMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['center'],
    closeOn: { leaveDocument: false },
    defaultOriginGetter: () => {
      const { clientWidth, clientHeight } = document.documentElement
      return { x: clientWidth / 2, y: clientHeight / 2 }
    }
  })

  useEffect(() => {
    const handleShowDialogMenu = (e: Event) => {
      const { detail } = e as CustomEvent
      setChildren(detail)
      requestAnimationFrame(() => openMenu())
    }
    openMenu()

    document.addEventListener(EVENTS.OPEN_DIALOG_MENU, handleShowDialogMenu)
    return () => document.removeEventListener(EVENTS.OPEN_DIALOG_MENU, handleShowDialogMenu)
  }, [])

  const blackBGStyle = isOpen ? '' : 'opacity-0 pointer-events-none'

  return (
    <div
      className={`
        absolute w-dvw h-dvh top-0 left-0 ${Z_INDEX.DIALOG_MENU}
        bg-black/35 backdrop-blur-[2px] ${blackBGStyle} transition-opacity duration-200
      `}
      onClick={closeMenu}
    >
      <MenuBase
        style={style}
        className={`
          flex flex-col items-center gap-2 px-10 py-8 max-w-xl
          ${Z_INDEX.DIALOG_MENU}
        `}
        isOpen={isOpen}
        ref={elementRef}
      >
        {children}
      </MenuBase>
    </div>
  )
}
