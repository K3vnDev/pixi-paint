import { PIXEL_ART_RES } from '@consts'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
  pixels: string[]
}

export const CanvasImage = ({ className = '', pixels }: Props) => {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = PIXEL_ART_RES
    canvas.height = PIXEL_ART_RES
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Draw each pixel
    pixels.forEach((pixelColor, i) => {
      const x = i % PIXEL_ART_RES
      const y = Math.floor(i / PIXEL_ART_RES)
      ctx.fillStyle = pixelColor
      ctx.fillRect(x, y, 1, 1)
    })

    ctx.imageSmoothingEnabled = false
    setDataUrl(canvas.toDataURL())
  }, [])

  if (!dataUrl) return null

  return (
    <Image
      width={PIXEL_ART_RES}
      height={PIXEL_ART_RES}
      src={dataUrl}
      alt={`A pixelated painting with a resolution of ${PIXEL_ART_RES}x${PIXEL_ART_RES}.`}
      className={twMerge(`rounded-sm ${className}`)}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
