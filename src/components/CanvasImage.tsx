import { CANVAS_RESOLUTION } from '@consts'
import type { ReusableComponent } from '@types'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

type Props = {
  dataUrl: string
} & ReusableComponent

export const CanvasImage = ({ dataUrl, className = '', ref, style }: Props) => (
  <Image
    ref={ref}
    width={CANVAS_RESOLUTION}
    height={CANVAS_RESOLUTION}
    src={dataUrl}
    alt={`A pixelated painting with a resolution of ${CANVAS_RESOLUTION}x${CANVAS_RESOLUTION}.`}
    className={twMerge(`rounded-sm ${className}`)}
    draggable={false}
    style={{ imageRendering: 'pixelated', ...style }}
  />
)
