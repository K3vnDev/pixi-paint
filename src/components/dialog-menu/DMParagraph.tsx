import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const DMParagraph = ({ className = '', children, ...props }: Props) => (
  <p
    className={twMerge(`
        text-theme-10/80 text-2xl text-pretty ${className}
      `)}
    {...props}
  >
    {children}
  </p>
)
