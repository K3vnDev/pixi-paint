import { PIXEL_ART_RES } from '@consts'
import { useCanvas } from '@/hooks/useCanvas'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
  const { canvas, canvasRef } = useCanvas()
  const gridTemplateColumns = `repeat(${PIXEL_ART_RES}, minmax(0, 1fr))`

  return (
    <div
      className='content-center size-[700px] grid'
      style={{ gridTemplateColumns }}
      draggable={false}
      ref={canvasRef}
    >
      {canvas.map((pixel, i) => (
        <Pixel color={pixel.color} index={i} key={i} />
      ))}
    </div>
  )
}
