import type { ReusableComponent } from '@types'
import { useContext, useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { MenuBase } from '@/components/MenuBase'
import { HTML_IDS } from '@/consts'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useMenuBase } from '@/hooks/useMenuBase'
import { useGeneralStore } from '@/store/useGeneralStore'
import { usePaintStore } from '@/store/usePaintStore'
import { validateColor } from '@/utils/validateColor'
import { TextInput } from './TextInput'

interface Props {
  parentRef: ReusableComponent['ref']
}

export const PickerMenu = ({ parentRef }: Props) => {
  const { pickerColor, setPickerColor, lastValidColor, setMenuIsOpen } = useContext(ColorSelectorContext)

  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const elementRef = useRef<HTMLDialogElement>(null)
  const setIsUsingInput = useGeneralStore(s => s.setIsUsingInput)

  const { isOpen, openMenu, style } = useMenuBase({
    elementRef,
    transformOrigins: ['right'],
    horizontal: true,
    elementSelector: `#${HTML_IDS.PICKER_MENU}`,
    closeOn: {
      leaveDocument: false,
      scroll: true,
      keys: ['Escape', 'Enter']
    },
    events: {
      onOpenMenu: () => {
        setPickerColor(refs.current.primaryColor)
      }
    }
  })

  const refs = useFreshRefs({ isOpen, primaryColor })
  const COLOR_DELAY = 75
  const debouncedPickerColor = useDebounce(pickerColor, COLOR_DELAY, true)

  // Pair state input value
  useEffect(() => {
    setIsUsingInput(isOpen)
    setMenuIsOpen(isOpen)
  }, [isOpen])

  // Handle pointer events
  useEffect(() => {
    const handlePointerUp = (e: PointerEvent) => {
      if (clickedInside(e) && !refs.current.isOpen && parentRef?.current) {
        const parentRect = (parentRef.current as HTMLElement).getBoundingClientRect()

        const x = -parentRect.width / 1.5
        const y = parentRect.height / 2

        openMenu({ x, y })
      }
    }

    const clickedInside = (e: PointerEvent) => {
      const parent: HTMLElement = parentRef?.current
      if (!parent) return false

      const target = e.target as HTMLElement
      return parent.contains(target) || elementRef.current?.contains(target)
    }

    document.addEventListener('pointerup', handlePointerUp, { capture: true })
    return () => document.removeEventListener('pointerup', handlePointerUp, { capture: true })
  }, [])

  // Refresh primary color
  useEffect(() => {
    const { value, isValid } = validateColor(debouncedPickerColor)

    if (isValid) {
      lastValidColor.current = value
      setPrimaryColor(value)
    }
  }, [debouncedPickerColor])

  return (
    <MenuBase ref={elementRef} {...{ isOpen, style }} className='px-5 py-6 z-50 flex flex-col gap-4 w-min'>
      <HexColorPicker color={pickerColor} onChange={setPickerColor} />
      <TextInput />
      <div
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+1px)]
          rotate-45 size-8 rounded-tr-sm bg-theme-bg border-t-2 border-r-2 border-theme-20 -z-10
        `}
      />
    </MenuBase>
  )
}
