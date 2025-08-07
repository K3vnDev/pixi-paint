import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const ZoneWrapper = ({ children, className = '' }: Props) => {
  return (
    <div className={twMerge(`bg-theme-20 border-2 border-theme-10 rounded-2xl ${className}`)}>{children}</div>
  )
}
