import type { ToolbarTool as ToolbarToolType } from '@types'
import { useEffect } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { CursorImage } from './CursorImage'

export const ToolbarTool = ({ cursor, tool, shortcut }: ToolbarToolType) => {
  const setSelectedTool = usePaintStore(s => s.setTool)
  const selectedTool = usePaintStore(s => s.tool)
  const IMAGE_SIZE = 90

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

  const outline = selectedTool === tool ? 'outline-4 outline-white' : ''
  const title = `${cursor.name} (${shortcut})`

  return (
    <button
      title={title}
      className={`bg-blue-500 rounded-md size-24 button relative ${outline}`}
      onClick={handleClick}
      onFocusCapture={e => e.preventDefault()}
    >
      <CursorImage
        className={{ both: 'left-1/2 top-1/2 -translate-1/2' }}
        size={IMAGE_SIZE}
        {...cursor}
        alt={`A pixel art of the ${cursor.name} tool.`}
      />
    </button>
  )
}
