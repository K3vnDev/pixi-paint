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

  const pickerRef = useRef<HTMLElement>(null)

  useActionOnKey('S', () => {
    swapColors()
  }, [primaryColor, secondaryColor])

  const swapColors = () => {
    const [primary, secondary] = [primaryColor, secondaryColor]
    setPrimaryColor(secondary)
    setSecondaryColor(primary)
  }

  return (
    <ColorSelectorContext.Provider value={{ pickerColor, setPickerColor, lastValidColor }}>
      <section className='w-full aspect-square relative translate-0'>
        <ColorBase
          ref={pickerRef}
          className='absolute top-0 left-0 size-2/3 z-10 transition'
          color={primaryColor}
        >
          <PickerMenu parentRef={pickerRef} />
        </ColorBase>
        <ColorBase
          className='absolute bottom-0 right-0 size-1/2 transition'
          color={secondaryColor}
          onClick={swapColors}
        />
      </section>
    </ColorSelectorContext.Provider>
  )
}
