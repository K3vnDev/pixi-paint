import { COLOR_PALETTE } from '@consts'
import { PaletteColor } from './PaletteColor'

export const Palette = () => {
  const colors = Object.entries(COLOR_PALETTE).map(([, col]) => col)

  return (
    <section className='grid grid-cols-2 gap-3'>
      {colors.map(col => (
        <PaletteColor color={col} key={col} />
      ))}
    </section>
  )
}
