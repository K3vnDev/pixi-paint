import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ZoneWrapper } from '../ZoneWrapper'

type Props = {
  children: React.ReactNode
} & ReusableComponent

export const Item = ({ children, className, style }: Props) => {
  return (
    <ZoneWrapper
      className={twMerge(`
        h-25 w-29 relative button transition-all
        outline-theme-10 ${className}
      `)}
      style={style}
    >
      {children}
    </ZoneWrapper>
  )
}
