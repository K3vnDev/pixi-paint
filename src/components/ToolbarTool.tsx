import { CURSOR_SIZE } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import Image from 'next/image'
import { useEffect } from 'react'
import { usePaintStore } from '@/store/usePaintStore'

export const ToolbarTool = ({ name, tool, shortcut, imageSrc }: ToolbarToolType) => {
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

  const outline = selectedTool === tool ? 'outline-4 outline-white' : ''
  const title = `${name} (${shortcut})`

  return (
    <button
      title={title}
      className={`bg-blue-500 rounded-md size-24 button ${outline}`}
      onClick={handleClick}
      onFocusCapture={e => e.preventDefault()}
    >
      <Image
        unoptimized
        className='size-full'
        style={{ imageRendering: 'pixelated' }}
        src={`/imgs/${imageSrc}`}
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        alt={`A pixel art of the ${name} tool.`}
      />
    </button>
  )
}
