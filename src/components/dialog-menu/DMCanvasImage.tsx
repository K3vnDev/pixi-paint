import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { CanvasImage } from '../CanvasImage'

type Props = {
  pixels: string[]
} & ReusableComponent

export const DMCanvasImage = ({ pixels, className = '', ...props }: Props) => {
  const dataUrl = getPixelsDataUrl(pixels)
  return (
    <CanvasImage
      className={twMerge(`size-32 min-w-32 aspect-square animate-pulse-brightness ${className}`)}
      dataUrl={dataUrl}
      {...props}
    />
  )
}
