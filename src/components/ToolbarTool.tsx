import type { ToolbarTool as ToolbarToolType } from '@types'
import { useEffect } from 'react'
import { usePaintStore } from '@/store/usePaintStore'
import { CursorImage } from './CursorImage'
import { ZoneWrapper } from './ZoneWrapper'

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

  const outline = selectedTool === tool ? 'zone-wrapper-selected' : ''
  const title = `${cursor.name} (${shortcut})`

  return (
    <ZoneWrapper
      className={`
        h-26 w-29 relative button transition-all
        outline-theme-10 ${outline}
      `}
    >
      <button title={title} onClick={handleClick} onFocusCapture={e => e.preventDefault()}>
        <CursorImage
          className={{ both: 'left-1/2 top-1/2 -translate-1/2' }}
          size={IMAGE_SIZE}
          {...cursor}
          alt={`A pixel art of the ${cursor.name} tool.`}
        />
      </button>
    </ZoneWrapper>
  )
}
