import { usePaintStore } from '@/store/usePaintStore'
import { ColorBase } from './ColorBase'

export const Selector = () => {
  const primaryColor = usePaintStore(s => s.primaryColor)
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const secondaryColor = usePaintStore(s => s.secondaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const swapColors = () => {
    const [primary, secondary] = [primaryColor, secondaryColor]
    setPrimaryColor(secondary)
    setSecondaryColor(primary)
  }

  return (
    <section className='w-full aspect-square relative'>
      <ColorBase className='absolute top-0 left-0 size-2/3 z-10 transition' color={primaryColor} />
      <ColorBase
        className='absolute bottom-0 right-0 size-1/2 transition'
        color={secondaryColor}
        onClick={swapColors}
      />
    </section>
  )
}
