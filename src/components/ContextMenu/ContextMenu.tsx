'use client'

import { CONTEXT_MENU_FOCUSABLE, EVENTS, Z_INDEX } from '@consts'
import type { ContextMenuBuilder } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useTimeout } from '@/hooks/useTimeout'
import { Option } from './Option'

export const ContextMenu = () => {
  const [animation, setAnimation] = useState<string>(ANIMATION_VALUES.NONE)
  const isOpen = useRef(false)
  const isClosing = useRef(false)
  const ELEMENT_ID = 'CONTEXT_MENU'

  const [menuData, setMenuData] = useState<ContextMenuBuilder | null>(null)
  const { startTimeout, stopTimeout } = useTimeout()

  useEffect(() => {
    const handleOpenMenu = (e: Event) => {
      const menuBuilder: ContextMenuBuilder = (e as CustomEvent).detail
      openMenu(menuBuilder)
    }

    const handlePointerMove = (e: PointerEvent) => {
      // if (isOpen.current) {
      //   console.log(e.clientX, e.clientY)
      // }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!isOpen.current) return
      const validClick = !!(e.target as HTMLElement).closest(`#${ELEMENT_ID}, .${CONTEXT_MENU_FOCUSABLE}`)
      if (!validClick) closeMenu()
    }

    const handlePointerLeave = (_: PointerEvent) => {
      closeMenu()
    }

    document.addEventListener('pointermove', handlePointerMove, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener(EVENTS.CONTEXT_MENU, handleOpenMenu)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener(EVENTS.CONTEXT_MENU, handleOpenMenu)
    }
  }, [])

  const openMenu = async (builder: ContextMenuBuilder) => {
    await closeMenu(false)

    isOpen.current = true
    setMenuData(builder)
    setAnimation(ANIMATION_VALUES.SHOW)

    startTimeout(() => {
      setAnimation(ANIMATION_VALUES.NONE)
      stopTimeout()
    }, ANIMATION_TIMES.SHOW)
  }

  const closeMenu = (resetAnimation = true) =>
    new Promise<void>(res => {
      if (isClosing.current || !isOpen.current) return res()

      setAnimation(ANIMATION_VALUES.HIDE)
      isClosing.current = true

      stopTimeout()
      startTimeout(() => {
        resetAnimation && setAnimation(ANIMATION_VALUES.NONE)
        setMenuData(null)
        isClosing.current = false
        isOpen.current = false

        stopTimeout()
        res()
      }, ANIMATION_TIMES.HIDE)
    })

  if (!menuData) return null
  const { options, position } = menuData

  return (
    <dialog
      className={`
        absolute top-0 left-0 ${Z_INDEX.CONTEXT_MENU} py-1 rounded-xl origin-top-left
        bg-theme-50 border-2 border-theme-20 shadow-lg shadow-black/50
      `}
      style={{ left: `${position.x}px`, top: `${position.y}px`, animation }}
      id={ELEMENT_ID}
      open
    >
      {options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </dialog>
  )
}

const ANIMATION_TIMES = {
  SHOW: 150,
  HIDE: 70
} as const

const ANIMATION_VALUES = {
  SHOW: `context-menu-show ${ANIMATION_TIMES.SHOW}ms ease-out both`,
  HIDE: `context-menu-hide ${ANIMATION_TIMES.HIDE}ms ease-in both`,
  NONE: 'none'
} as const
