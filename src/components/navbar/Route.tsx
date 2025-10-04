import type { IconName, ReusableComponent } from '@types'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  name: string
  icon?: IconName
  path?: string
  isSelected?: boolean
} & ReusableComponent

export const Route = ({ name, icon, path, isSelected = false, className = '', ...props }: Props) => {
  const router = useRouter()

  const handleClick = () => {
    path && router.push(path)
  }

  const style = isSelected
    ? 'bg-theme-bg border-theme-20 lg:py-3.5 py-2.5 translate-y-[4px]'
    : 'active:text-theme-10/75 active:scale-90'

  return (
    <button
      className={twMerge(`
        lg:py-2.5 py-1.5 lg:px-12 md:px-8 sm:px-12 px-8 font-semibold text-xl 
        bg-black text-theme-10 origin-bottom transition-all duration-75 text-nowrap
        rounded-t-2xl border-4 border-b-0 border-transparent 
        flex items-center lg:gap-2 gap-1
        ${style} ${className}
      `)}
      onClick={handleClick}
      {...props}
    >
      {icon && <ColoredPixelatedImage icon={icon} />}
      {name}
    </button>
  )
}
