import { twMerge } from 'tailwind-merge'
import type { ReusableComponent } from '@/types'
import { DMZone } from './DMZone'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const DMZoneButtons = ({ children, className = '', ...props }: Props) => (
  <DMZone className={twMerge(`w-min mt-4 ${className}`)} {...props}>
    {children}
  </DMZone>
)
