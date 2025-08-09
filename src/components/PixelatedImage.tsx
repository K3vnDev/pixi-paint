import type { ReusableComponent } from '@types'
import Image from 'next/image'

type Props = {
  src: string
  imageSize?: number
  resolution: number
  alt: string
} & ReusableComponent

export const PixelatedImage = ({ imageSize, resolution, alt, src, className, style }: Props) => {
  const globalStyle: React.CSSProperties = {
    imageRendering: 'pixelated',
    width: imageSize,
    height: imageSize
  }

  return (
    <Image
      unoptimized
      width={resolution}
      height={resolution}
      {...{ alt, src, className }}
      style={{ ...globalStyle, ...style }}
    />
  )
}
