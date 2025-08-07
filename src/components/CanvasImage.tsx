import { PIXEL_ART_RES } from '@consts'
import type { ReusableComponent } from '@types'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

type Props = {
  dataUrl: string
} & ReusableComponent

export const CanvasImage = ({ dataUrl, className = '' }: Props) => (
  <Image
    width={PIXEL_ART_RES}
    height={PIXEL_ART_RES}
    src={dataUrl}
    alt={`A pixelated painting with a resolution of ${PIXEL_ART_RES}x${PIXEL_ART_RES}.`}
    className={twMerge(`rounded-sm ${className}`)}
    style={{ imageRendering: 'pixelated' }}
  />
)
