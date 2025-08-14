import { useRef } from 'react'
import { useActionOnKey } from '@/hooks/useActionOnKey'
import { usePaintStore } from '@/store/usePaintStore'
import { ColorBase } from '../ColorBase'
import { Picker } from './Picker'

export const Selector = () => {
  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const secondaryColor = usePaintStore(s => s.secondaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

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
    <section className='w-full aspect-square relative translate-0'>
      <ColorBase
        ref={pickerRef}
        className='absolute top-0 left-0 size-2/3 z-10 transition'
        color={primaryColor}
      >
        <Picker parentRef={pickerRef} initialColor={primaryColor} />
      </ColorBase>
      <ColorBase
        className='absolute bottom-0 right-0 size-1/2 transition'
        color={secondaryColor}
        onClick={swapColors}
      />
    </section>
  )
}
