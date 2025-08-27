import { twMerge } from 'tailwind-merge'
import type { ReusableComponent } from '@/types'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const DMZone = ({ children, className = '', ...props }: Props) => (
  <section
    className={twMerge(`
      flex items-center justify-center gap-5 py-2
      ${className}
    `)}
    {...props}
  >
    {children}
  </section>
)
