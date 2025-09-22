import { TOOLS } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'
import { ColorBase } from './ColorBase'

interface Props {
  color: string
}

export const PaletteColor = ({ color }: Props) => {
  const setSelectedColor = usePaintStore(s => s.setPrimaryColor)
  const selectedColor = usePaintStore(s => s.primaryColor)

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
    <ColorBase
      className={`
        lg:size-16 md:h-12 h-10 w-full not-lg:rounded-none not-lg:outline-none 
        lg:aspect-square button ${outline}
      `}
      color={color}
      onClick={handleClick}
    />
  )
}
