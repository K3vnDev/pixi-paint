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
        animate-appear opacity-100 text-2xl font-bold text-theme-10 px-1 h-11
        flex items-center bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card
        ${className}
      `)}
      {...props}
    >
      {icon ? <ColoredPixelatedImage icon={icon} className='bg-theme-10 size-10' /> : children}
    </span>
  )
}
