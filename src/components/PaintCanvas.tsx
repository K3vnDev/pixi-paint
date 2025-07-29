import { PIXEL_ART_RES } from '@consts'
import { usePaintCanvas } from '@/hooks/usePaintCanvas'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
  const { pixels, canvasRef, showTool } = usePaintCanvas()
  const gridTemplateColumns = `repeat(${PIXEL_ART_RES}, minmax(0, 1fr))`

  const cursor = ['cursor-pointer-px', 'cursor-brush-px', 'cursor-eraser-px', 'cursor-bucket-px'][showTool]

  return (
    <div
      className={`content-center size-[700px] grid ${cursor}`}
      style={{ gridTemplateColumns }}
      draggable={false}
      ref={canvasRef}
    >
      {pixels.map((pixelColor, i) => (
        <Pixel color={pixelColor} index={i} key={i} />
      ))}
    </div>
  )
}
