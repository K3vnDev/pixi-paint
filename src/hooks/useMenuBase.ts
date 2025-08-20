import type { Origin, Position as PositionType, TransformOrigin } from '@types'
import { useEffect, useRef, useState } from 'react'
import { animationData as animData } from '@/utils/animationData'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { useAnimations } from './useAnimations'
import { useFreshRefs } from './useFreshRefs'

interface Params {
  elementRef: React.RefObject<HTMLElement | null>
  transformOrigins: TransformOrigin[]
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
  hideWhen?: boolean
}

interface Position extends PositionType {
  transformOrigin?: string
}

export const useMenuBase = ({
  elementRef,
  transformOrigins,
  events: { onOpenMenu, afterOpenMenuAnim, onCloseMenu, afterCloseMenuAnim } = {},
  closeOn: {
    scroll: closeOnScroll = true,
    leaveDocument: closeOnLeaveDocument = true,
    distance: closeAtDistance = -1
  } = {},
  elementSelector,
  horizontal = false,
  hideWhen = false
}: Params) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>()

  const isClosing = useRef(false)
  const onCloseQueuedAction = useRef<() => void>(null)

  const [show, hide] = horizontal
    ? [animData.menuShowHorizontal(), animData.menuHideHorizontal()]
    : [animData.menuShowVertical(), animData.menuHideVertical()]

  const { animation, anims, startAnimation } = useAnimations({ animations: { show, hide } })
  const refs = useFreshRefs({ isOpen, animation })

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

  const openMenu = (origin?: Origin) => {
    const tryOpen = () => {
      requestAnimationFrame(() => {
        onOpenMenu?.()
        origin && refreshPosition(origin)
        setIsOpen(true)
        startAnimation(anims.show, afterOpenMenuAnim)
      })
    }

    if (isClosing.current) {
      onCloseQueuedAction.current = tryOpen
    } else {
      tryOpen()
    }
  }

  const closeMenu = () =>
    new Promise<void>(res => {
      if (!refs.current.isOpen) return res()

      isClosing.current = true
      onCloseMenu?.()

      startAnimation(anims.hide, () => {
        isClosing.current = false
        setIsOpen(false)
        afterCloseMenuAnim?.()
        res()

        onCloseQueuedAction.current?.()
        onCloseQueuedAction.current = null
      })
    })

  const refreshPosition = ({ x, y }: Origin) => {
    if (!elementRef.current || refs.current.animation) return

    const { width, height } = elementRef.current.getBoundingClientRect()
    const { clientWidth, clientHeight } = document.documentElement

    const calcIsWithinBounds = (x: number, y: number) => {
      return x >= 0 && x <= clientWidth && y >= 0 && y <= clientHeight
    }

    interface CalculatedPosition {
      left: number
      top: number
      transformOrigin: string
    }

    let firstCalculatedPosition: CalculatedPosition | null = null

    const setPositionUtility = ({ left, top, transformOrigin }: CalculatedPosition) => {
      setPosition({
        left: `${left}px`,
        top: `${top}px`,
        transformOrigin: transformOrigin.replace('-', ' ')
      })
    }

    // Iterate over tranform origins to find a valid one
    for (const transformOrigin of transformOrigins) {
      const has = (str: string) => transformOrigin.split('-').includes(str)
      const calcPositonMult = (kw1: string, kw2: string) => (has(kw1) ? 0 : has(kw2) ? -1 : -0.5)

      const positionMultiplier = {
        x: calcPositonMult('left', 'right'),
        y: calcPositonMult('top', 'bottom')
      }

      const leftPosition = x + width * positionMultiplier.x
      const topPosition = y + height * positionMultiplier.y

      const leftGrow = x + width * (positionMultiplier.x + 1)
      const topGrow = y + height * (positionMultiplier.y + 1)

      const isWithinBounds =
        calcIsWithinBounds(leftPosition, topPosition) && calcIsWithinBounds(leftGrow, topGrow)

      const calculatedPosition = {
        left: leftPosition,
        top: topPosition,
        transformOrigin
      }

      // If its within bounds, return position
      if (isWithinBounds) {
        setPositionUtility(calculatedPosition)
        return
      }
      // Save first calculated position
      firstCalculatedPosition ??= calculatedPosition
    }

    firstCalculatedPosition && setPositionUtility(firstCalculatedPosition)
  }

  const isHiding = !isOpen || hideWhen

  const style: React.CSSProperties = {
    ...position,
    animation,
    pointerEvents: isHiding || animation ? 'none' : undefined,
    opacity: isHiding ? 0 : undefined
  }

  return { isOpen, openMenu, closeMenu, style, refreshPosition }
}
