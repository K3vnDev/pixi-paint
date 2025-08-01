import { CURSOR_SIZE } from '@consts'
import type { Cursor as CursorType } from '@types'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { usePaintStore } from '@/store/usePaintStore'

type Props = {
  size: number
  alt: string
  className?: {
    both?: string
    mainImg?: string
    colorImg?: string
  }
} & CursorType

export const CursorImage = ({ alt, imageUrl, colorImageUrl, size, className }: Props) => {
  const selectedColor = usePaintStore(s => s.color)

  const globalStyle: React.CSSProperties = {
    imageRendering: 'pixelated',
    width: size,
    height: size
  }
  const globalClass = `absolute aspect-square left-0 top-0 ${className?.both}`

  return (
    <>
      <Image
        className={twMerge(`${globalClass} ${className?.mainImg}`)}
        unoptimized
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        alt={alt}
        src={imageUrl}
        style={{
          ...globalStyle,
          filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, .5))'
        }}
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
