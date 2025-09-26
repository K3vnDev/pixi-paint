import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  children?: React.ReactNode
  icon?: IconName
} & ReusableComponent

export const CreationCanvasIndicator = ({ children, icon, className = '', ...props }: Props) => {
  return (
    <span
      className={twMerge(`
        animate-appear opacity-100 sm:text-2xl text-lg font-bold text-theme-10 sm:px-1 px-0.5 sm:h-11 h-9
        flex items-center bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card
        ${className}
      `)}
      {...props}
    >
      {icon ? <ColoredPixelatedImage icon={icon} className='bg-theme-10 sm:size-10 size-8' /> : children}
    </span>
  )
}
