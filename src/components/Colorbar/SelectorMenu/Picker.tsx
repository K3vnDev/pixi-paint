import type { ReusableComponent } from '@types'
import { useContext, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useFreshRef } from '@/hooks/useFreshRef'
import { useGeneralStore } from '@/store/useGeneralStore'
import { usePaintStore } from '@/store/usePaintStore'
import { validateColor } from '@/utils/validateColor'
import { TextInput } from './TextInput'

interface Props {
  parentRef: ReusableComponent['ref']
}

export const Picker = ({ parentRef }: Props) => {
  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const { pickerColor, setPickerColor, lastValidColor } = useContext(ColorSelectorContext)

  const elementRef = useRef<HTMLSpanElement>(null)
  const setIsUsingInput = useGeneralStore(s => s.setIsUsingInput)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: '0px', top: '0px' })

  const refs = useFreshRef({ isOpen, primaryColor })
  const COLOR_DELAY = 75
  const debouncedPickerColor = useDebounce(pickerColor, COLOR_DELAY, true)

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
      if (!parent || !elementRef.current) return false
      const target = e.target as HTMLElement
      return parent.contains(target) || elementRef.current.contains(target)
    }

    document.addEventListener('pointerup', handlePointerUp, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })

    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerdown', handlePointerDown)
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
    if (!parentRef?.current || !elementRef.current) return

    const elementRect = elementRef.current.getBoundingClientRect()
    const parentRect = (parentRef.current as HTMLElement).getBoundingClientRect()

    const margin = 28
    const left = -elementRect.width - margin
    const top = parentRect.height / 2 - elementRect.height / 2

    setPosition({ left: `${left}px`, top: `${top}px` })
    setIsOpen(true)
    setIsUsingInput(true)
    setPickerColor(refs.current.primaryColor)
  }

  const close = () => {
    setIsOpen(false)
    setIsUsingInput(false)
  }

  const style = isOpen ? '' : 'opacity-0'

  return (
    <span
      className={`
        fixed px-5 py-6 bg-theme-50 border-2 border-theme-20 rounded-xl
        ${style} transition-all origin-right z-50 shadow-card flex flex-col gap-4 w-min
      `}
      ref={elementRef}
      style={{ ...position }}
    >
      <HexColorPicker color={pickerColor} onChange={setPickerColor} />
      <TextInput />
      <div
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+1px)] rotate-45 size-8 rounded-tr-sm
          bg-theme-50 border-t-2 border-r-2 border-theme-20 -z-10
        `}
      />
    </span>
  )
}
