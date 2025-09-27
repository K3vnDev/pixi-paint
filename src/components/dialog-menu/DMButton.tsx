import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  children?: React.ReactNode
  icon?: IconName
  onClick?: () => void | Promise<void>
  empty?: boolean
  preventAutoClose?: boolean
  isLoading?: boolean
  disabled?: boolean
} & ReusableComponent

export const DMButton = ({
  children,
  className = '',
  icon,
  onClick,
  empty = false,
  isLoading = false,
  disabled = false,
  preventAutoClose = false,
  ...props
}: Props) => {
  const { closeMenu } = useDialogMenu()
  const bgStyle = !empty ? 'border-theme-10/60 bg-theme-20/80 animate-pulse-brightness' : 'border-theme-10/25'
  const usingIcon: IconName | undefined = isLoading ? 'loading' : icon
  const animationStyle = isLoading ? 'animate-step-spin' : ''

  const handleClick = () => {
    onClick?.()
    !preventAutoClose && closeMenu()
  }

  return (
    <button
      className={twMerge(`
        flex items-center font-semibold text-theme-10 border-2 
        md:px-6 px-4 md:py-2.5 py-2 md:text-2xl text-xl md:gap-2 gap-1
        rounded-lg button text-nowrap ${bgStyle} disabled:animate-none ${className}
      `)}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {usingIcon && (
        <ColoredPixelatedImage icon={usingIcon} className={`size-8 bg-theme-10 ${animationStyle}`} />
      )}
      {children}
    </button>
  )
}
