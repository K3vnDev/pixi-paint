import { twMerge } from 'tailwind-merge'
import type { ReusableComponent } from '@/types'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const DMZoneButtons = ({ children, className = '', ...props }: Props) => (
  <section
    className={twMerge(`
      flex w-full items-center justify-center gap-4 mt-5
      ${className}
    `)}
    {...props}
  >
    {children}
  </section>
)
