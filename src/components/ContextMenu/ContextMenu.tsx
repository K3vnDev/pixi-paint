'use client'

import { EVENTS, Z_INDEX } from '@consts'
import type { ContextMenuBuilder } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useTimeout } from '@/hooks/useTimeout'
import { Option } from './Option'

export const ContextMenu = () => {
  const [animation, setAnimation] = useState<string>(ANIMATION_VALUES.NONE)
  const [menuData, setMenuData] = useState<ContextMenuBuilder | null>(null)
  const isOpen = useRef(false)
  const isClosing = useRef(false)
  const CLOSE_DISTANCE = 350

  const { startTimeout, stopTimeout } = useTimeout()
  const ELEMENT_ID = 'CONTEXT_MENU'
  const elementRef = useRef<HTMLDialogElement>(null)

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

        const distance = Math.sqrt(Math.abs(clientX - center.x) ** 2 + Math.abs(clientY - center.y) ** 2)
        if (distance > CLOSE_DISTANCE) {
          closeMenu()
        }
      }
    }

    const handlePointerDown = ({ target }: PointerEvent) => {
      if (isOpen.current) {
        const clickedInside = !!(target as HTMLElement).closest(`#${ELEMENT_ID}`)
        if (!clickedInside) closeMenu()
      }
    }

    const handleCloseMenu = () => {
      closeMenu()
    }

    document.addEventListener('pointermove', handlePointerMove, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    document.addEventListener('pointerleave', handleCloseMenu)
    document.addEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenMenu)
    document.addEventListener(EVENTS.CLOSE_CONTEXT_MENU, handleCloseMenu)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerleave', handleCloseMenu)
      document.removeEventListener(EVENTS.OPEN_CONTEXT_MENU, handleOpenMenu)
      document.removeEventListener(EVENTS.CLOSE_CONTEXT_MENU, handleCloseMenu)
    }
  }, [])

  const openMenu = async (builder: ContextMenuBuilder) => {
    await closeMenu(false)

    isOpen.current = true
    setMenuData(builder)
    setAnimation(ANIMATION_VALUES.SHOW)

    stopTimeout()
    isClosing.current = false

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
      ref={elementRef}
    >
      {options.map((option, i) => (
        <Option closeMenu={closeMenu} key={i} {...option} />
      ))}
    </dialog>
  )
}

const ANIMATION_TIMES = {
  SHOW: 130,
  HIDE: 70
} as const

const ANIMATION_VALUES = {
  SHOW: `context-menu-show ${ANIMATION_TIMES.SHOW}ms ease-out both`,
  HIDE: `context-menu-hide ${ANIMATION_TIMES.HIDE}ms ease-in both`,
  NONE: 'none'
} as const
