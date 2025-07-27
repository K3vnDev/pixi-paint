'use client'

import { TOOLS } from '@consts'
import type { ToolbarItem } from '@types'
import { useEffect } from 'react'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { usePaintStore } from '@/store/usePaintStore'

export const ToolBar = () => {
  const items: ToolbarItem[] = [
    {
      name: 'Brush',
      tool: TOOLS.BRUSH,
      shortcut: 'B'
    },
    {
      name: 'Eraser',
      tool: TOOLS.ERASER,
      shortcut: 'E'
    },
    {
      name: 'Bucket',
      tool: TOOLS.BUCKET,
      shortcut: 'G'
    }
  ]

  return (
    <aside className='absolute flex flex-col left-8 gap-4'>
      {items.map(item => (
        <Item {...item} key={item.tool} />
      ))}
      <SaveState />
    </aside>
  )
}

const Item = ({ name, tool, shortcut }: ToolbarItem) => {
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
  const label = `${name} (${shortcut})`

  return (
    <button title={label} className={`bg-blue-400 size-24 button ${outline}`} onClick={handleClick}>
      {label}
    </button>
  )
}

const SaveState = () => {
  const { isDraft, createNewSave, createNewDraft } = useSaveCanvases()

  const handleClick = () => {
    if (isDraft) {
      createNewSave()
    } else {
      createNewDraft()
    }
  }

  return (
    <button
      className='bg-blue-300 size-24 flex items-center justify-center mt-8 button px-2'
      onClick={handleClick}
    >
      {isDraft ? 'Draft. Click to save' : 'Saved! Click to start a new draft'}
    </button>
  )
}
