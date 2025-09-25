import type { ContextMenuOption } from '@types'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  closeMenu: () => void
} & ContextMenuOption

export const Option = ({ label, icon, action, closeMenu }: Props) => {
  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation()
    action()
    closeMenu()
  }

  return (
    <button
      className={`
        flex items-center bg-transparent hover:bg-black/40 w-full 
        pl-3 pr-5 py-1 gap-1.5 active:bg-black/20 min-h-12 z-99
      `}
      onPointerUp={handleClick}
    >
      {icon && <ColoredPixelatedImage icon={icon} className='bg-theme-10 size-12' />}
      <span className='text-theme-10 text-xl font-semibold'>{label}</span>
    </button>
  )
}
