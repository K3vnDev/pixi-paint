import type { GalleryCanvas as GalleryCanvasType } from '@types'
import { twMerge } from 'tailwind-merge'
import { useGridCanvasStyles } from '@/hooks/useGridCanvasStyles'
import { CanvasImage } from '../CanvasImage'

export const GalleryCanvas = ({ dataUrl, id, isVisible }: GalleryCanvasType) => {
  const { classNameStyles } = useGridCanvasStyles({ isVisible })

  return (
    <li
      key={id}
      className={twMerge(`relative w-full aspect-square transition-all ${classNameStyles.canvasState}`)}
    >
      <CanvasImage className='size-full' dataUrl={dataUrl} />
    </li>
  )
}
