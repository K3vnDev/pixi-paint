import { SPRITES_RESOLUTION, SPRITES_SIZE } from '@consts'
import type { Cursor as CursorType } from '@types'
import { twMerge } from 'tailwind-merge'
import { usePaintStore } from '@/store/usePaintStore'
import { ColoredPixelatedImage } from './ColoredPixelatedImage'
import { PixelatedImage } from './PixelatedImage'

type Props = {
  alt: string
  className?: {
    both?: string
    mainImg?: string
    colorImg?: string
  }
  overrideSize?: number
} & CursorType

export const CursorImage = ({ alt, imageName, colorize, className, overrideSize }: Props) => {
  const colors = {
    primary: usePaintStore(s => s.primaryColor),
    secondary: usePaintStore(s => s.secondaryColor)
  }

  const spritesSize = overrideSize ?? SPRITES_SIZE

  const globalStyle: React.CSSProperties = {
    imageRendering: 'pixelated',
    width: spritesSize,
    height: spritesSize
  }
  const globalClass = `absolute aspect-square left-0 top-0 ${className?.both}`
  const getImageUrl = (name: string) => `/imgs/tools/${name}.png`

  return (
    <>
      <PixelatedImage
        className={twMerge(`cursor-shadow ${globalClass} ${className?.mainImg}`)}
        resolution={SPRITES_RESOLUTION}
        alt={alt}
        src={getImageUrl(imageName)}
        style={globalStyle}
      />
      {colorize && (
        <ColoredPixelatedImage
          src={getImageUrl(`${imageName}_color`)}
          className={twMerge(`transition-colors ${globalClass} ${className?.colorImg}`)}
          style={{
            backgroundColor: colors[colorize],
            ...globalStyle
          }}
        />
      )}
    </>
  )
}
