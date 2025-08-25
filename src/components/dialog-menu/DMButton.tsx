import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  children?: React.ReactNode
  icon?: IconName
  onClick?: () => void | Promise<void>
  empty?: boolean
} & ReusableComponent

export const DMButton = ({ children, className = '', icon, onClick, empty = false, ...props }: Props) => {
  const bgStyle = !empty ? 'bg-theme-20/80' : ''

  return (
    <button
      className={twMerge(`
        flex gap-2 items-center text-2xl font-semibold text-theme-10 px-4 py-2.5 border-2 border-theme-10/60 rounded-lg button ${bgStyle} ${className}
      `)}
      {...{ onClick, ...props }}
    >
      {icon && <ColoredPixelatedImage icon={icon} className='size-8 bg-theme-10' />}
      {children}
    </button>
  )
}
