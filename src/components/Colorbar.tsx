import { COLOR_PALETTE, TOOLS } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'

export const Colorbar = () => {
  // Parse color palette into a string array
  const colors = Object.entries(COLOR_PALETTE).map(([, col]) => col)

  return (
    <aside className='flex flex-col gap-2 absolute right-8'>
      <ul className='grid grid-cols-2 gap-2'>
        {colors.map(col => (
          <Color color={col} key={col} />
        ))}
      </ul>
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
