import { MenuBase } from '@@/MenuBase'
import type { Origin, ReusableComponent, TransformOrigin } from '@types'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { HTML_IDS } from '@/consts'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useMenuBase } from '@/hooks/useMenuBase'
import { useResponsiveness } from '@/hooks/useResponsiveness'
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

  const { media } = useResponsiveness()
  const [transOrigin, offset] = useMemo<[TransformOrigin, Origin]>(
    () => (media.lg ? ['right', { x: -48, y: -96 }] : ['top', { x: -48, y: 84 }]),
    [media]
  )

  const { isOpen, openMenu, refreshPosition, style } = useMenuBase({
    elementRef,
    transformOrigins: [transOrigin],
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
    },
    defaultOriginGetter: () => {
      const parent = parentRef?.current as HTMLElement
      if (refs.current.isOpen && !parent) return undefined

      const { height } = parent.getBoundingClientRect()
      const { offset, media } = refs.current

      return media.lg
        ? {
            x: offset.x,
            y: height / 2.5 + offset.y
          }
        : offset
    }
  })

  const COLOR_DELAY = 75
  const debouncedPickerColor = useDebounce(pickerColor, COLOR_DELAY)

  const refs = useFreshRefs({ isOpen, primaryColor, offset, media })

  // Pair state input value
  useEffect(() => {
    setIsUsingInput(isOpen)
    setMenuIsOpen(isOpen)
  }, [isOpen])

  // Handle click event
  useEvent(
    'click',
    () => {
      !refs.current.isOpen && openMenu()
    },
    {
      target: parentRef,
      capture: true,
      deps: [media]
    }
  )

  useEffect(refreshPosition, [])

  // Refresh primary color
  useEffect(() => {
    const { value, isValid } = validateColor(debouncedPickerColor)

    if (isValid) {
      lastValidColor.current = value
      setPrimaryColor(value)
    }
  }, [debouncedPickerColor])

  const decoStyle: React.CSSProperties = media.lg
    ? { top: '50%', right: 0, translate: `calc(50% + 1px) calc(-50% - ${offset.y}px)`, rotate: '45deg' }
    : { top: 0, right: 0, translate: `calc(${offset.x}px + 12px) calc(-50% - 1px)`, rotate: '-45deg' }

  return (
    <MenuBase
      ref={elementRef}
      {...{ isOpen, style }}
      className='fixed px-5 py-6 z-50 flex flex-col gap-4 w-min'
    >
      <HexColorPicker color={pickerColor} onChange={setPickerColor} />
      <TextInput />

      <div // Tiny triangle decoration
        className={`
          absolute size-8 rounded-tr-sm 
          bg-theme-bg border-t-2 border-r-2 border-theme-20 -z-10
        `}
        style={decoStyle}
      />
    </MenuBase>
  )
}
