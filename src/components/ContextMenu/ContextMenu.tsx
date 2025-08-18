'use client'

import { EVENTS, HTML_IDS, Z_INDEX } from '@consts'
import type { ContextMenuBuilder } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useAnimations } from '@/hooks/useAnimations'
import { animationData } from '@/utils/animationData'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { Option } from './Option'

export const ContextMenu = () => {
  const [menuData, setMenuData] = useState<ContextMenuBuilder | null>(null)
  const isOpen = useRef(false)
  const isClosing = useRef(false)
  const CLOSE_DISTANCE = 350

  const elementRef = useRef<HTMLDialogElement>(null)

  const { animation, anims, startAnimation } = useAnimations({
    animations: {
      show: animationData.menuShowVertical(),
      hide: animationData.menuHideVertical()
    }
  })

  useEffect(() => {
    const handleOpenMenu = (e: Event) => {
      const menuBuilder: ContextMenuBuilder = (e as CustomEvent).detail
      openMenu(menuBuilder)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (isOpen.current && elementRef.current) {
        const { top, left, width, height } = elementRef.current.getBoundingClientRect()

        const center = { x: left + width / 2, y: top + height / 2 }
        const { clientX, clientY } = e

        const distance = Math.sqrt((clientX - center.x) ** 2 + (clientY - center.y) ** 2)
        if (distance > CLOSE_DISTANCE) {
          closeMenu()
        }
      }
    }

    const handlePointerDown = ({ target }: PointerEvent) => {
      if (isOpen.current) {
        if (!wasInsideElement(target).id(HTML_IDS.CONTEXT_MENU)) closeMenu()
      }
    }

    const handleCloseMenu = () => {
      closeMenu()
    }

    document.addEventListener('pointermove', handlePointerMove, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    document.addEventListener('pointerleave', handleCloseMenu)
    document.addEventListener('scroll', handleCloseMenu)
    document.addEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenMenu)
    document.addEventListener(EVENTS.CLOSE_CONTEXT_MENU, handleCloseMenu)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove, { capture: true })
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
      document.removeEventListener('pointerleave', handleCloseMenu)
      document.removeEventListener('scroll', handleCloseMenu)
      document.removeEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenMenu)
      document.removeEventListener(EVENTS.CLOSE_CONTEXT_MENU, handleCloseMenu)
    }
  }, [])

  const openMenu = async (builder: ContextMenuBuilder) => {
    await closeMenu()

    isOpen.current = true
    setMenuData(builder)
    startAnimation(anims.show)
    isClosing.current = false
  }

  const closeMenu = () =>
    new Promise<void>(res => {
      if (isClosing.current || !isOpen.current) return res()

      startAnimation(anims.hide, () => {
        setMenuData(null)
        isClosing.current = false
        isOpen.current = false

        res()
      })
      isClosing.current = true
      document.dispatchEvent(new Event(EVENTS.CONTEXT_MENU_CLOSED))
    })

  if (!menuData) return null
  const { options, position } = menuData

  return (
    <dialog
      className={`
        fixed top-0 left-0 ${Z_INDEX.CONTEXT_MENU} py-1 rounded-xl origin-top-left
        bg-theme-bg border-2 border-theme-20 shadow-card
      `}
      style={{ left: `${position.x}px`, top: `${position.y}px`, animation }}
      id={HTML_IDS.CONTEXT_MENU}
      open
      ref={elementRef}
    >
      {options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </dialog>
  )
}
