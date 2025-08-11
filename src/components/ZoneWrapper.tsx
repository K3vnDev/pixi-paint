import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const ZoneWrapper = ({ children, className = '', ref }: Props) => {
  return (
    <div className={twMerge(`bg-theme-20 outline-2 outline-theme-10 rounded-2xl ${className}`)} ref={ref}>
      {children}
    </div>
  )
}
