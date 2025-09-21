import { COLOR_PALETTE } from '@consts'
import { useMemo } from 'react'
import { PaletteColor } from './PaletteColor'

export const Palette = () => {
  const colors = useMemo(() => Object.entries(COLOR_PALETTE).map(([, col]) => col), [])

  return (
    <section
      className={`
        grid grid-cols-6 lg:grid-cols-2 lg:gap-3 not-lg:overflow-clip
      outline-theme-10 not-lg:outline-2 not-lg:rounded-md
        not-lg:w-full not-lg:max-w-96
      `}
    >
      {colors.map(col => (
        <PaletteColor color={col} key={col} />
      ))}
    </section>
  )
}
