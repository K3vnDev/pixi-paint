import type { Origin, Position as PositionType, TransformOrigin } from '@types'
import { useEffect, useRef, useState } from 'react'
import { animationData as animData } from '@/utils/animationData'
import { wasInsideElement } from '@/utils/wasInsideElement'
import { useActionOnKey } from './useActionOnKey'
import { useAnimations } from './useAnimations'
import { useDebounce } from './useDebounce'
import { useEvent } from './useEvent'
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
    keys?: string[]
  }
  elementSelector?: string
  horizontal?: boolean
  hideWhen?: boolean
  defaultOriginGetter?: () => Origin | undefined
}

interface Position extends PositionType {
  transformOrigin?: string
}

/**
 * Custom hook for managing the open/close state, positioning, and animation of a menu component.
 *
 * @param elementRef - A React ref to the menu DOM element.
 * @param transformOrigins - An array of possible CSS transform-origin strings to use for positioning.
 * @param events.onOpenMenu - Callback invoked before the menu opens.
 * @param events.afterOpenMenuAnim - Callback invoked after the open animation completes.
 * @param events.onCloseMenu - Callback invoked before the menu closes.
 * @param events.afterCloseMenuAnim - Callback invoked after the close animation completes.
 * @param closeOn.scroll - Whether to close the menu on scroll (default: true).
 * @param closeOn.leaveDocument - Whether to close the menu when the pointer leaves the document (default: true).
 * @param closeOn.distance - Distance in pixels from the menu center at which to close the menu (default: -1, disabled).
 * @param closeOn.keys - Array of key names that will close the menu when pressed (default: ['Escape']).
 * @param elementSelector - Optional CSS selector string to determine if a pointer event target is inside the menu.
 * @param horizontal - Whether to use horizontal animations (default: false).
 * @param hideWhen - Condition to hide the menu (default: false).
 *
 * @returns An object containing:
 * - `isOpen`: Boolean indicating if the menu is open.
 * - `openMenu(origin?: Origin)`: Function to open the menu at a given origin.
 * - `closeMenu()`: Function to close the menu, returns a Promise that resolves when closing is complete.
 * - `style`: React CSS properties to apply to the menu for positioning and animation.
 * - `refreshPosition(origin: Origin)`: Function to recalculate and update the menu's position.
 *
 * @remarks
 * - The hook manages event listeners for pointer and scroll events to handle automatic closing.
 * - Menu positioning is calculated to keep the menu within viewport bounds based on the provided transform origins.
 * - Animations are handled via a custom animation hook and can be customized for horizontal or vertical menus.
 */
export const useMenuBase = ({
  elementRef,
  transformOrigins,
  events: { onOpenMenu, afterOpenMenuAnim, onCloseMenu, afterCloseMenuAnim } = {},
  closeOn: {
    scroll: closeOnScroll = true,
    leaveDocument: closeOnLeaveDocument = true,
    distance: closeAtDistance = -1,
    keys: closeOnKeys = ['Escape']
  } = {},
  elementSelector,
  horizontal = false,
  hideWhen = false,
  defaultOriginGetter
}: Params) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>()

  const isClosing = useRef(false)
  const onCloseQueuedAction = useRef<() => void>(null)

  const [show, hide] = horizontal
    ? [animData.menuShowHorizontal(), animData.menuHideHorizontal()]
    : [animData.menuShowVertical(), animData.menuHideVertical()]

  const { animation, anims, startAnimation } = useAnimations({ animations: { show, hide } })
  const [resizedCount, setResizedCount] = useState(0)
  const debouncedResizedCount = useDebounce(resizedCount, 15, false)

  const refs = useFreshRefs({
    isOpen,
    animation,
    closeOnLeaveDocument,
    closeOnScroll,
    defaultOriginGetter,
    elementSelector,
    closeAtDistance
  })

  useActionOnKey({
    key: closeOnKeys,
    action: () => {
      refs.current.isOpen && closeMenu()
    },
    options: {
      allowCtrlKey: true,
      allowOnInput: true,
      allowShiftKey: true
    }
  })

  useEvent(
    'pointermove',
    (e: PointerEvent) => {
      const { isOpen, closeAtDistance } = refs.current
      if (isOpen && elementRef.current && closeAtDistance > 0) {
        const { top, left, width, height } = elementRef.current.getBoundingClientRect()

        const center = { x: left + width / 2, y: top + height / 2 }
        const { clientX, clientY } = e

        const distance = Math.sqrt((clientX - center.x) ** 2 + (clientY - center.y) ** 2)
        if (distance > closeAtDistance) {
          closeMenu()
        }
      }
    },
    { capture: true }
  )

  useEvent(
    'pointerdown',
    ({ target }: PointerEvent) => {
      const { elementSelector, isOpen } = refs.current
      if (elementSelector && isOpen && !wasInsideElement(target).selector(elementSelector)) {
        closeMenu()
      }
    },
    { capture: true }
  )

  useEvent('pointerleave', () => refs.current.closeOnLeaveDocument && closeMenu())
  useEvent('scroll', () => refs.current.closeOnScroll && closeMenu())

  // Handle resize
  useEvent('resize', () => setResizedCount(c => c + 1), { target: 'window' })
  useEffect(() => {
    if (debouncedResizedCount) {
      const origin = refs.current.defaultOriginGetter?.()
      origin && refreshPosition(origin)
    }
  }, [debouncedResizedCount])

  const openMenu = (origin?: Origin) => {
    const tryOpen = () => {
      requestAnimationFrame(() => {
        onOpenMenu?.()

        // Refresh position
        const refreshOrigin = origin ?? defaultOriginGetter?.()
        refreshOrigin && refreshPosition(refreshOrigin)

        // Open and animate
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
