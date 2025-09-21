import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent &
  React.HTMLAttributes<HTMLDivElement>

export const ZoneWrapper = ({ children, className = '', ref, ...reactProps }: Props) => (
  <div
    className={twMerge(`
      bg-theme-20 outline-2 outline-theme-10 lg:rounded-2xl rounded-xl
      ${className}
    `)}
    ref={ref}
    {...reactProps}
  >
    {children}
  </div>
)
