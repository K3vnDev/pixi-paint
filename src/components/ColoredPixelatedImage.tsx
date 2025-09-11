import { twMerge } from 'tailwind-merge'
import type { IconName, ReusableComponent } from '@/types'
import { getIconPath } from '@/utils/getIconPath'

type Props = {
  src?: string
  icon?: IconName
} & ReusableComponent

export const ColoredPixelatedImage = ({ src, icon, className = '', ref, style }: Props) => {
  const imageUrl = src || icon ? (src ?? getIconPath(icon ?? 'code')) : ''

  return (
    <div
      ref={ref}
      className={twMerge(`bg-theme-10 size-8 ${className}`)}
      style={{
        WebkitMask: `url(${imageUrl}) no-repeat center / contain`,
        mask: `url(${imageUrl}) no-repeat center / contain`,
        imageRendering: 'pixelated',
        ...style
      }}
    />
  )
}
