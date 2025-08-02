import { COLOR_PALETTE, TOOLS } from '@consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'

export const Colorbar = () => {
  const colors = Object.entries(COLOR_PALETTE).map(([, col]) => col)
  const showGrid = useCanvasStore(s => s.showGrid)
  const setShowGrid = useCanvasStore(s => s.setShowGrid)

  const toggleGrid = () => setShowGrid(!showGrid)

  return (
    <aside className='flex flex-col gap-8 absolute right-8'>
      <ul className='grid grid-cols-2 gap-2'>
        {colors.map(col => (
          <Color color={col} key={col} />
        ))}
      </ul>
      <button className='bg-blue-400 h-24 rounded-xl' onClick={toggleGrid}>
        {showGrid ? 'Hide grid' : 'Show Grid'}
      </button>
    </aside>
  )
}

interface ColorProps {
  color: string
}

const Color = ({ color }: ColorProps) => {
  const setSelectedColor = usePaintStore(s => s.setColor)
  const selectedColor = usePaintStore(s => s.color)

  const setSelectedTool = usePaintStore(s => s.setTool)
  const selectedTool = usePaintStore(s => s.tool)

  const handleClick = () => {
    setSelectedColor(color)

    if (selectedTool === TOOLS.ERASER) {
      setSelectedTool(TOOLS.BRUSH)
    }
  }

  const outline = colorComparison(selectedColor, color) ? 'outline-4 outline-white' : ''

  return (
    <li
      className={`size-16 button rounded-sm ${outline}`}
      style={{ background: color }}
      onClick={handleClick}
    />
  )
}
