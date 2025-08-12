import type { ReusableComponent } from '@/types'

type Props = {
  src: string
} & ReusableComponent

export const ColoredPixelatedImage = ({ src, className = '', ref, style }: Props) => (
  <div
    ref={ref}
    className={className}
    style={{
      WebkitMask: `url(${src}) no-repeat center / contain`,
      mask: `url(${src}) no-repeat center / contain`,
      imageRendering: 'pixelated',
      ...style
    }}
  />
)
