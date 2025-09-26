import { EVENTS, TOOLS } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'
import { colorComparison } from '@/utils/colorComparison'
import { ColorBase } from './ColorBase'

interface Props {
  color: string
}

export const PaletteColor = ({ color }: Props) => {
  const setSelectedColor = usePaintStore(s => s.setPrimaryColor)
  const selectedColor = usePaintStore(s => s.primaryColor)
  const selectedTool = usePaintStore(s => s.tool)

  const handleClick = () => {
    setSelectedColor(color)

    if ([TOOLS.ERASER, TOOLS.COLOR_PICKER].includes(selectedTool)) {
      document.dispatchEvent(new CustomEvent(EVENTS.SELECT_LAST_PAINT_TOOL))
    }
  }

  const outline = colorComparison(selectedColor, color)
    ? 'lg:outline-3 not-lg:rounded-xs not-lg:border-2 brightness-selected'
    : 'not-lg:outline-none'

  return (
    <ColorBase
      className={`
        lg:size-16 md:h-12 h-10 w-full not-lg:rounded-none not-lg:outline-none
        border-theme-10 lg:aspect-square lg:button transition-all 
        not-lg:active:brightness-90 ${outline}
      `}
      color={color}
      onClick={handleClick}
    />
  )
}
