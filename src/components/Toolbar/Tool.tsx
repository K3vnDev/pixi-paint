import type { ToolbarTool } from '@types'
import { useEffect } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { CursorImage } from '../CursorImage'
import { Item } from './Item'

export const Tool = ({ cursor, tool, shortcut }: ToolbarTool) => {
  const setSelectedTool = usePaintStore(s => s.setTool)
  const selectedTool = usePaintStore(s => s.tool)

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

  const outline = selectedTool === tool ? 'zone-wrapper-selected' : ''
  const title = `${cursor.name} (${shortcut})`

  return (
    <Item className={outline}>
      <button title={title} onClick={handleClick} onFocusCapture={e => e.preventDefault()}>
        <CursorImage
          className={{ both: 'left-1/2 top-1/2 -translate-1/2' }}
          alt={`A pixel art of the ${cursor.name} tool.`}
          {...cursor}
        />
      </button>
    </Item>
  )
}
