import { TOOLS } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'

interface Props {
  color: string
}

export const ColorbarColor = ({ color }: Props) => {
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

  const outline = colorComparison(selectedColor, color) ? 'outline-3 brightness-selected' : ''

  return (
    <li
      className={`size-16 button rounded-md outline-2 outline-theme-10 ${outline}`}
      style={{ background: color }}
      onClick={handleClick}
    />
  )
}
