import { SPRITES_RESOLUTION, SPRITES_SIZE } from '@consts'
import type { Cursor as CursorType } from '@types'
import { twMerge } from 'tailwind-merge'
import { usePaintStore } from '@/store/usePaintStore'
import { PixelatedImage } from './PixelatedImage'

type Props = {
  alt: string
  className?: {
    both?: string
    mainImg?: string
    colorImg?: string
  }
} & CursorType

export const CursorImage = ({ alt, imageUrl, colorImageUrl, className }: Props) => {
  const selectedColor = usePaintStore(s => s.color)

  const globalStyle: React.CSSProperties = {
    imageRendering: 'pixelated',
    width: SPRITES_SIZE,
    height: SPRITES_SIZE
  }
  const globalClass = `absolute aspect-square left-0 top-0 ${className?.both}`

  return (
    <>
      <PixelatedImage
        className={twMerge(`cursor-shadow ${globalClass} ${className?.mainImg}`)}
        resolution={SPRITES_RESOLUTION}
        alt={alt}
        src={imageUrl}
        style={globalStyle}
      />
      {colorImageUrl && (
        <div
          className={twMerge(`${globalClass} ${className?.colorImg}`)}
          style={{
            backgroundColor: selectedColor,
            WebkitMask: `url(${colorImageUrl}) no-repeat center / contain`,
            mask: `url(${colorImageUrl}) no-repeat center / contain`,
            ...globalStyle
          }}
        />
      )}
    </>
  )
}
