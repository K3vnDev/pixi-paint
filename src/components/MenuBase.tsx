import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
  isOpen: boolean
} & ReusableComponent &
  React.ComponentPropsWithoutRef<'dialog'>

export const MenuBase = ({ children, className, style, isOpen, ...props }: Props) => (
  <dialog
    className={twMerge(`
      fixed bg-theme-bg border-2 border-theme-20 rounded-xl shadow-card
      ${className}
    `)}
    style={{ ...style }}
    {...props}
    open
  >
    {children}
  </dialog>
)
