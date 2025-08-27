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
        pb-3 px-8 mb-2 text-3xl text-theme-10 font-bold text-nowrap border-b-3 border-theme-10/20 border-dashed
        flex items-center gap-2 ${className}
      `)}
    {...props}
  >
    {icon && <ColoredPixelatedImage icon={icon} className='size-8 bg-theme-10' />}
    {children}
  </header>
)
