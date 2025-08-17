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
  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const { pickerColor, setPickerColor, lastValidColor } = useContext(ColorSelectorContext)

  const elementRef = useRef<HTMLDialogElement>(null)
  const setIsUsingInput = useGeneralStore(s => s.setIsUsingInput)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<React.CSSProperties>()
  const isClosing = useRef(false)

  const refs = useFreshRef({ isOpen, primaryColor, position })
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
    if (!position && isOpen && elementRef.current && parentRef?.current) {
      // Calculate position
      const elementRect = elementRef.current.getBoundingClientRect()
      const parentRect = (parentRef.current as HTMLElement).getBoundingClientRect()

      const margin = 28
      const left = -elementRect.width - margin
      const top = parentRect.height / 2 - elementRect.height / 2

      setPosition({ left: `${left}px`, top: `${top}px` })
    }

    // Pair state input value
    setIsUsingInput(isOpen)
  }, [isOpen])

  // Handle pointer events
  useEffect(() => {
    const parent: HTMLElement = parentRef?.current

    const handlePointerUp = (e: PointerEvent) => {
      if (clickedInside(e) && !refs.current.isOpen) open()
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
    if (refs.current.isOpen && isClosing.current) return
    setIsOpen(true)
    setPickerColor(refs.current.primaryColor)

    if (!refs.current.position) {
      setTimeout(() => startAnimation(anims.show))
    } else {
      startAnimation(anims.show)
    }
  }

  const close = () => {
    if (!refs.current.isOpen || isClosing.current) return
    isClosing.current = true

    startAnimation(anims.hide, () => {
      setIsOpen(false)
      isClosing.current = false
    })
  }

  if (!isOpen) return null
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
      <TextInput menuIsOpen={isOpen} closeMenu={close} />
      <div
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+1px)] rotate-45 size-8 rounded-tr-sm
          bg-theme-50 border-t-2 border-r-2 border-theme-20 -z-10
        `}
      />
    </dialog>
  )
}
