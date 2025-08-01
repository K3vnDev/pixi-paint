'use client'

import { CURSORS, TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { ToolbarTool } from './ToolbarTool'

export const ToolBar = () => {
  const tools: ToolbarToolType[] = [
    {
      cursor: CURSORS[1],
      tool: TOOLS.BRUSH,
      shortcut: 'B'
    },
    {
      cursor: CURSORS[2],
      tool: TOOLS.ERASER,
      shortcut: 'E'
    },
    {
      cursor: CURSORS[3],
      tool: TOOLS.BUCKET,
      shortcut: 'G'
    },
    {
      cursor: CURSORS[4],
      tool: TOOLS.COLOR_PICKER,
      shortcut: 'I'
    }
  ]

  return (
    <aside className='absolute flex flex-col left-8 gap-4'>
      {tools.map(tool => (
        <ToolbarTool {...tool} key={tool.tool} />
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
      className='bg-blue-300 size-24 flex items-center justify-center mt-8 button px-2'
      onClick={handleClick}
    >
      {isDraft ? 'Draft. Click to save' : 'Saved! Click to start a new draft'}
    </button>
  )
}
