import { PIXEL_ART_RES } from '@consts'
import { usePaintCanvas } from '@/hooks/usePaintCanvas'
import { useCanvasPixelsAppearing } from '@/hooks/usePixelsAppearing'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
  const { pixels, canvasRef } = usePaintCanvas()
  const { visiblePixelsMap } = useCanvasPixelsAppearing(pixels)

  const gridTemplateColumns = `repeat(${PIXEL_ART_RES}, minmax(0, 1fr))`

  return (
    <div
      className='content-center size-[var(--canvas-size)] grid overflow-clip rounded-md'
      style={{ gridTemplateColumns }}
      draggable={false}
      ref={canvasRef}
      id='paint-canvas'
    >
      {pixels.map((pixelColor, i) => (
        <Pixel isVisible={visiblePixelsMap[i]} color={pixelColor} index={i} key={i} />
      ))}
    </div>
  )
}
