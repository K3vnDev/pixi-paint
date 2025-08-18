import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import { useRef, useState } from 'react'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useActionOnKey } from '@/hooks/useActionOnKey'
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

  const pickerRef = useRef<HTMLElement>(null)

  useActionOnKey('S', () => {
    swapColors()
  }, [primaryColor, secondaryColor])

  const swapColors = () => {
    const [primary, secondary] = [primaryColor, secondaryColor]
    setPrimaryColor(secondary)
    setSecondaryColor(primary)
  }

  const arrows = [{ pos: 'top-0 right-0' }, { pos: 'bottom-0 left-0', rot: 'rotate-180' }]
  const pickerButtonStyle = menuIsOpen ? '' : 'button'

  return (
    <ColorSelectorContext.Provider
      value={{ pickerColor, setPickerColor, lastValidColor, menuIsOpen, setMenuIsOpen }}
    >
      <section className='w-full aspect-square relative translate-0 group'>
        <ColorBase
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
