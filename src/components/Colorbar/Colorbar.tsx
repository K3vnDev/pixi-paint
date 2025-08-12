import { ZoneWrapper } from '../ZoneWrapper'
import { Palette } from './Palette'

export const Colorbar = () => {
  return (
    <ZoneWrapper className='absolute right-[var(--sidebar-margin)] py-8 px-5 animate-slide-in-right'>
      <aside className='flex flex-col gap-8'>
        <Palette />
      </aside>
    </ZoneWrapper>
  )
}
