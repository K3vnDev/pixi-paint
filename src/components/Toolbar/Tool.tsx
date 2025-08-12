import type { ToolbarTool } from '@types'
import { useEffect, useRef } from 'react'
import { useTooltip } from '@/hooks/useTooltip'
import { usePaintStore } from '@/store/usePaintStore'
import { firstToUpper } from '@/utils/firstToUpper'
import { CursorImage } from '../CursorImage'
import { Item } from './Item'

export const Tool = ({ cursor, tool, shortcut }: ToolbarTool) => {
  const setSelectedTool = usePaintStore(s => s.setTool)
  const selectedTool = usePaintStore(s => s.tool)
  const elementRef = useRef<HTMLElement>(null)

  const tooltipName = `${firstToUpper(cursor.name)} (${shortcut})`
  useTooltip({ ref: elementRef, text: tooltipName })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === shortcut) {
        setSelectedTool(tool)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClick = () => {
    setSelectedTool(tool)
  }

  const selectedStyle = selectedTool === tool ? 'outline-5 brightness-selected translate-x-1.5' : ''

  return (
    <Item ref={elementRef} className={selectedStyle}>
      <button onClick={handleClick} onFocusCapture={e => e.preventDefault()}>
        <CursorImage
          className={{ both: 'left-1/2 top-1/2 -translate-1/2' }}
          alt={`A pixel art of the ${cursor.name} tool.`}
          {...cursor}
        />
      </button>
    </Item>
  )
}
