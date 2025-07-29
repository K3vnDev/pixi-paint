'use client'

import { TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { ToolbarTool } from './ToolbarTool'

export const ToolBar = () => {
  const items: ToolbarToolType[] = [
    {
      name: 'Brush',
      tool: TOOLS.BRUSH,
      shortcut: 'B',
      imageSrc: 'tools/brush.png'
    },
    {
      name: 'Eraser',
      tool: TOOLS.ERASER,
      shortcut: 'E',
      imageSrc: 'tools/eraser.png'
    },
    {
      name: 'Bucket',
      tool: TOOLS.BUCKET,
      shortcut: 'G',
      imageSrc: 'tools/bucket.png'
    }
  ]

  return (
    <aside className='absolute flex flex-col left-8 gap-4'>
      {items.map(item => (
        <ToolbarTool {...item} key={item.tool} />
      ))}
      <SaveState />
    </aside>
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
      className='bg-blue-300 size-24 flex items-center justify-center mt-8 button cursor-pointer-px px-2'
      onClick={handleClick}
    >
      {isDraft ? 'Draft. Click to save' : 'Saved! Click to start a new draft'}
    </button>
  )
}
