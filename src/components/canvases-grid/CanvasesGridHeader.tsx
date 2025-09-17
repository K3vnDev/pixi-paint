import { Z_INDEX } from '@consts'
import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const CanvasesGridHeader = ({ children, className = '', ...props }: Props) => (
  <header
    className={twMerge(`
      fixed w-full left-0 top-[var(--navbar-height)] backdrop-blur-md ${Z_INDEX.NAVBAR}
      bg-gradient-to-b from-25% from-theme-bg to-theme-bg/60
      flex gap-5 py-6 px-[var(--galery-pad-x)] border-theme-20/50 ${className}
    `)}
    {...props}
  >
    {children}
  </header>
)
