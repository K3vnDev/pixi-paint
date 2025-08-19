import type { Origin, Position } from '@types'
import { useEffect, useRef, useState } from 'react'
import { animationData as animData } from '@/utils/animationData'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { useAnimations } from './useAnimations'
import { useFreshRefs } from './useFreshRefs'

interface Params {
  elementRef: React.RefObject<HTMLElement | null>
  events?: {
    onOpenMenu?: () => void
    afterOpenMenuAnim?: () => void
    onCloseMenu?: () => void
    afterCloseMenuAnim?: () => void
  }
  closeOn?: {
    scroll?: boolean
    leaveDocument?: boolean
    distance?: number
  }
  elementSelector?: string
  horizontal?: boolean
}

export const useMenuBase = ({
  elementRef,
  events: { onOpenMenu, afterOpenMenuAnim, onCloseMenu, afterCloseMenuAnim } = {},
  closeOn: {
    scroll: closeOnScroll = true,
    leaveDocument: closeOnLeaveDocument = true,
    distance: closeAtDistance = -1
  } = {},
  elementSelector,
  horizontal = false
}: Params) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>()

  const refs = useFreshRefs({ isOpen })
  const isClosing = useRef(false)

  const [show, hide] = horizontal
    ? [animData.menuShowHorizontal(), animData.menuHideHorizontal()]
    : [animData.menuShowVertical(), animData.menuHideVertical()]

  const { animation, anims, startAnimation } = useAnimations({ animations: { show, hide } })

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (refs.current.isOpen && elementRef.current && closeAtDistance > 0) {
        const { top, left, width, height } = elementRef.current.getBoundingClientRect()

        const center = { x: left + width / 2, y: top + height / 2 }
        const { clientX, clientY } = e

        const distance = Math.sqrt((clientX - center.x) ** 2 + (clientY - center.y) ** 2)
        if (distance > closeAtDistance) {
          closeMenu()
        }
      }
    }

    const handlePointerDown = ({ target }: PointerEvent) => {
      if (elementSelector && refs.current.isOpen && !wasInsideElement(target).selector(elementSelector)) {
        closeMenu()
      }
    }

    const handlePointerLeave = () => {
      if (closeOnLeaveDocument) closeMenu()
    }

    const handleScroll = () => {
      if (closeOnScroll) closeMenu()
    }

    document.addEventListener('pointermove', handlePointerMove, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('scroll', handleScroll, { capture: true })

    return () => {
      document.removeEventListener('pointermove', handlePointerMove, { capture: true })
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
      document.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [])

  const openMenu = async (origin?: Origin) => {
    await closeMenu()

    onOpenMenu?.()
    setIsOpen(true)
    isClosing.current = false
    origin && refreshPosition(origin)

    startAnimation(anims.show, afterOpenMenuAnim)
  }

  const closeMenu = () =>
    new Promise<void>(res => {
      if (isClosing.current || !refs.current.isOpen) return res()

      isClosing.current = true
      onCloseMenu?.()

      startAnimation(anims.hide, () => {
        isClosing.current = false
        setIsOpen(false)
        afterCloseMenuAnim?.()
        res()
      })
    })

  const refreshPosition = ({ x, y }: Origin) => {
    setPosition({ left: `${x}px`, top: `${y}px` })
  }

  return { isOpen, openMenu, closeMenu, animation, position }
}
