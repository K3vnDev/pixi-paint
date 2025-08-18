import type { ReusableComponent } from '@types'
import { useContext, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useAnimations } from '@/hooks/useAnimations'
import { useDebounce } from '@/hooks/useDebounce'
import { useFreshRef } from '@/hooks/useFreshRef'
import { useGeneralStore } from '@/store/useGeneralStore'
import { usePaintStore } from '@/store/usePaintStore'
import { animationData } from '@/utils/animationData'
import { validateColor } from '@/utils/validateColor'
import { TextInput } from './TextInput'

interface Props {
  parentRef: ReusableComponent['ref']
}

export const PickerMenu = ({ parentRef }: Props) => {
  const { pickerColor, setPickerColor, lastValidColor, menuIsOpen, setMenuIsOpen } =
    useContext(ColorSelectorContext)

  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const elementRef = useRef<HTMLDialogElement>(null)
  const setIsUsingInput = useGeneralStore(s => s.setIsUsingInput)
  const [position, setPosition] = useState<React.CSSProperties>()
  const isClosing = useRef(false)

  const refs = useFreshRef({ menuIsOpen, primaryColor, position })
  const COLOR_DELAY = 75
  const debouncedPickerColor = useDebounce(pickerColor, COLOR_DELAY, true)

  const { animation, anims, startAnimation } = useAnimations({
    animations: {
      show: animationData.menuShowHorizontal(),
      hide: animationData.menuHideHorizontal()
    },
    preserve: true
  })

  useEffect(() => {
    if (!position && menuIsOpen && elementRef.current && parentRef?.current) {
      // Calculate position
      const elementRect = elementRef.current.getBoundingClientRect()
      const parentRect = (parentRef.current as HTMLElement).getBoundingClientRect()

      const MARGIN = 32
      const left = -elementRect.width - MARGIN
      const top = parentRect.height / 2 - elementRect.height / 2

      setPosition({ left: `${left}px`, top: `${top}px` })
    }

    // Pair state input value
    setIsUsingInput(menuIsOpen)
  }, [menuIsOpen])

  // Handle pointer events
  useEffect(() => {
    const parent: HTMLElement = parentRef?.current

    const handlePointerUp = (e: PointerEvent) => {
      if (clickedInside(e) && !refs.current.menuIsOpen) open()
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!clickedInside(e)) close()
    }

    const clickedInside = (e: PointerEvent) => {
      if (!parent) return false
      const target = e.target as HTMLElement
      return parent.contains(target) || elementRef.current?.contains(target)
    }

    document.addEventListener('pointerup', handlePointerUp, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })

    return () => {
      document.removeEventListener('pointerup', handlePointerUp, { capture: true })
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
    }
  }, [])

  // Refresh primary color
  useEffect(() => {
    const { value, isValid } = validateColor(debouncedPickerColor)

    if (isValid) {
      lastValidColor.current = value
      setPrimaryColor(value)
    }
  }, [debouncedPickerColor])

  const open = () => {
    const { menuIsOpen, position, primaryColor } = refs.current

    if (menuIsOpen && isClosing.current) return
    setMenuIsOpen(true)
    setPickerColor(primaryColor)

    if (!position) {
      setTimeout(() => startAnimation(anims.show))
    } else {
      startAnimation(anims.show)
    }
  }

  const close = () => {
    if (!refs.current.menuIsOpen || isClosing.current) return
    isClosing.current = true

    startAnimation(anims.hide, () => {
      setMenuIsOpen(false)
      isClosing.current = false
    })
  }

  if (!menuIsOpen) return null
  const opacity = !animation ? 'opacity-0' : ''

  return (
    <dialog
      className={`
        fixed px-5 py-6 bg-theme-50 border-2 border-theme-20 rounded-xl shadow-card
        origin-right z-50 flex flex-col gap-4 w-min ${opacity}
      `}
      open
      ref={elementRef}
      style={{ ...position, animation }}
    >
      <HexColorPicker color={pickerColor} onChange={setPickerColor} />
      <TextInput menuIsOpen={menuIsOpen} closeMenu={close} />
      <div
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+1px)] rotate-45 size-8 rounded-tr-sm
          bg-theme-50 border-t-2 border-r-2 border-theme-20 -z-10
        `}
      />
    </dialog>
  )
}
