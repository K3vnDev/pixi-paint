import { twMerge } from 'tailwind-merge'
import type { ReusableComponent } from '@/types'
import { DMZone } from './DMZone'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const DMParagraphsZone = ({ children, className = '', ...props }: Props) => (
  <DMZone
    className={twMerge(`
      flex-col gap-3.5 items-start ${className}
    `)}
    {...props}
  >
    {children}
  </DMZone>
)
