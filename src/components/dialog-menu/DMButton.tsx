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
        flex gap-2 items-center text-2xl font-semibold text-theme-10 px-6 py-2.5 border-2 
        rounded-lg button text-nowrap ${bgStyle} ${className}
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
