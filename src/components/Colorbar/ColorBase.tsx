import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  onClick?: () => void
  color: string
  children?: React.ReactNode
} & ReusableComponent &
  React.ComponentPropsWithoutRef<'span'>

export const ColorBase = ({ className = '', ref, style, onClick, color, children, ...props }: Props) => (
  <span
    className={twMerge(`
      rounded-md outline-2 outline-theme-10 ${className}
    `)}
    style={{ backgroundColor: color, ...style }}
    {...{ ref, onClick, ...props }}
  >
    {children}
  </span>
)
