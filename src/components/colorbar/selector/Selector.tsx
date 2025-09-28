import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import { useRef, useState } from 'react'
import { HTML_IDS } from '@/consts'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useActionOnKey } from '@/hooks/useActionOnKey'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { usePaintStore } from '@/store/usePaintStore'
import { ColorBase } from '../ColorBase'
import { PickerMenu } from './PickerMenu'

export const Selector = () => {
  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const secondaryColor = usePaintStore(s => s.secondaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)
  const [pickerColor, setPickerColor] = useState(primaryColor)
  const lastValidColor = useRef(primaryColor)
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const hydrated = useCanvasesStore(s => s.hydrated)

  const pickerRef = useRef<HTMLElement>(null)

  const swapColors = () => {
    const [primary, secondary] = [primaryColor, secondaryColor]
    setPrimaryColor(secondary)
    setSecondaryColor(primary)
  }

  useActionOnKey({
    key: 'S',
    action: swapColors,
    deps: [primaryColor, secondaryColor]
  })

  const arrows = [{ pos: 'top-0 right-0' }, { pos: 'bottom-0 left-0', rot: 'rotate-180' }]
  const pickerButtonStyle = menuIsOpen ? '' : 'button'
  const visibility = hydrated ? '' : 'opacity-0 blur-xs scale-90'

  return (
    <ColorSelectorContext.Provider
      value={{ pickerColor, setPickerColor, lastValidColor, menuIsOpen, setMenuIsOpen }}
    >
      <section
        className={`
          lg:size-full md:size-24 size-20 aspect-square relative translate-0 group
          transition-[opacity,filter,scale] duration-400 ${visibility}
        `}
      >
        {/* Colors */}
        <ColorBase
          id={HTML_IDS.PICKER_MENU}
          ref={pickerRef}
          className={`absolute top-0 left-0 size-2/3 z-10 transition ${pickerButtonStyle}`}
          color={primaryColor}
        >
          <PickerMenu parentRef={pickerRef} />
        </ColorBase>

        <ColorBase
          className='absolute bottom-0 right-0 size-1/2 transition group button'
          color={secondaryColor}
          onClick={swapColors}
        />

        {/* Arrow buttons */}
        {arrows.map(({ pos, rot = '' }, i) => (
          <button
            key={i}
            className={`
              absolute size-1/2 button flex items-center justify-center
              group-hover:opacity-50 group-hover:blur-none blur-sm opacity-10
              transition duration-300 -z-10 ${pos}
            `}
            onClick={swapColors}
          >
            <ColoredPixelatedImage
              icon='arrows-corner'
              className={`size-1/2 bg-theme-10 absolute ${pos} ${rot}`}
            />
          </button>
        ))}
      </section>
    </ColorSelectorContext.Provider>
  )
}
