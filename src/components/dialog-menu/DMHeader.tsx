import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  children?: React.ReactNode
  icon?: IconName
} & ReusableComponent

export const DMHeader = ({ children, className = '', icon, ...props }: Props) => (
  <header
    className={twMerge(`
      pb-3 md:px-8 px-2 md:mb-3 md:text-3xl text-2xl md:gap-2 gap-1
      text-theme-10 font-bold text-nowrap border-b-3 
      border-theme-10/20 border-dashed flex items-center ${className}
    `)}
    {...props}
  >
    {icon && <ColoredPixelatedImage icon={icon} className='md:size-8 size-7 bg-theme-10' />}
    {children}
  </header>
)
