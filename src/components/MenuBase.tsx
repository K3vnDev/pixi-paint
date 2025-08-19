import type { Position, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
  animation: string
  isOpen: boolean
  position?: Position
} & ReusableComponent &
  React.ComponentPropsWithoutRef<'dialog'>

export const MenuBase = ({ children, className, style, animation, isOpen, position, ...props }: Props) =>
  isOpen ? (
    <dialog
      className={twMerge(`
        fixed bg-theme-bg border-2 border-theme-20 rounded-xl shadow-card
        ${className}
      `)}
      style={{ animation, ...position, ...style }}
      {...props}
      open
    >
      {children}
    </dialog>
  ) : null
