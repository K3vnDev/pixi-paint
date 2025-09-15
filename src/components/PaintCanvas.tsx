import { CANVAS_RESOLUTION, HTML_IDS } from '@consts'
import { usePaintCanvas } from '@/hooks/usePaintCanvas'
import { useCanvasPixelsAppearing } from '@/hooks/usePixelsAppearing'
import { useUserPublishedIds } from '@/hooks/useUserPublishedIds'
import { CanvasOutline } from './CanvasOutline'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
  const { pixels, canvasRef } = usePaintCanvas()
  const { visiblePixelsMap } = useCanvasPixelsAppearing(pixels)

  const gridTemplateColumns = `repeat(${CANVAS_RESOLUTION}, minmax(0, 1fr))`
  useUserPublishedIds()

  return (
    <CanvasOutline>
      <div
        className={`
          content-center size-[var(--canvas-size)] grid 
          overflow-clip rounded-md relative
        `}
        style={{ gridTemplateColumns }}
        draggable={false}
        ref={canvasRef}
        id={HTML_IDS.PAINT_CANVAS}
      >
        {pixels.map((pixelColor, i) => (
          <Pixel isVisible={visiblePixelsMap[i]} color={pixelColor} index={i} key={i} />
        ))}
      </div>
    </CanvasOutline>
  )
}
