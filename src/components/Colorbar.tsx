import { COLOR_PALETTE } from '@consts'
import { ColorbarColor } from './ColorbarColor'
import { ZoneWrapper } from './ZoneWrapper'

export const Colorbar = () => {
  const colors = Object.entries(COLOR_PALETTE).map(([, col]) => col)

  return (
    <ZoneWrapper className='absolute right-[var(--sidebar-margin)] py-8 px-5'>
      <aside className='flex flex-col gap-8'>
        <ul className='grid grid-cols-2 gap-3'>
          {colors.map(col => (
            <ColorbarColor color={col} key={col} />
          ))}
        </ul>
      </aside>
    </ZoneWrapper>
  )
}
