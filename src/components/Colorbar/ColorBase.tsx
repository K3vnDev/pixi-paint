import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  onClick?: () => void
  color: string
  children?: React.ReactNode
} & ReusableComponent

export const ColorBase = ({ className = '', ref, style, onClick, color, children }: Props) => (
  <span
    className={twMerge(`
      rounded-md outline-2 outline-theme-10 ${className}
    `)}
    style={{
      backgroundColor: color,
      ...style
    }}
    {...{ ref, onClick }}
  >
    {children}
  </span>
)
