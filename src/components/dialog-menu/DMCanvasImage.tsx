import type { ReusableComponent } from '@types'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { CanvasImage } from '../CanvasImage'

type Props = {
  pixels?: string[]
  dataUrl?: string
} & ReusableComponent

export const DMCanvasImage = ({ pixels, dataUrl, className = '', ...props }: Props) => {
  const extractedDataUrl = useMemo(
    () => dataUrl ?? (pixels ? getPixelsDataUrl(pixels) : null),
    [pixels, dataUrl]
  )

  return extractedDataUrl ? (
    <CanvasImage
      className={twMerge(`
        md:size-32 md:min-w-32 size-40 min-w-40 aspect-square animate-pulse-brightness rounded-xl
        border-4 border-theme-10/50 ${className}
      `)}
      dataUrl={extractedDataUrl}
      {...props}
    />
  ) : null
}
