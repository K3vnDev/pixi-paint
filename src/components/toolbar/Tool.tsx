import type { ToolbarTool } from '@types'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useActionOnKey } from '@/hooks/useActionOnKey'
import { useTooltip } from '@/hooks/useTooltip'
import { usePaintStore } from '@/store/usePaintStore'
import { parseKebabName } from '@/utils/parseKebabName'
import { CursorImage } from '../CursorImage'
import { Item } from './Item'

type Props = {
  spriteSize: number
} & ToolbarTool

export const Tool = ({ cursor, tool, shortcut, spriteSize: cursorSize }: Props) => {
  const setSelectedTool = usePaintStore(s => s.setTool)
  const selectedTool = usePaintStore(s => s.tool)
  const elementRef = useRef<HTMLElement>(null)

  const toolName = parseKebabName(cursor.imageName)
  const tooltipName = `${toolName} (${shortcut})`
  useTooltip({ ref: elementRef, text: tooltipName })

  const selectTool = () => {
    setSelectedTool(tool)
  }

  useActionOnKey({ key: shortcut, action: selectTool })

  const selectedStyle =
    selectedTool === tool ? 'outline-5 brightness-selected lg:translate-x-1.5 not-lg:-translate-y-1.5' : ''

  return (
    <Item
      ref={elementRef}
      className={twMerge(`
        not-lg:px-0 not-lg:py-2 ${selectedStyle}  
      `)}
      onClick={selectTool}
      onFocusCapture={e => e.preventDefault()}
    >
      <CursorImage
        className={{ both: 'left-1/2 top-1/2 -translate-1/2' }}
        alt={`A pixel art of the ${toolName} tool.`}
        overrideSize={cursorSize}
        {...cursor}
      />
    </Item>
  )
}
