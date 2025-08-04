'use client'

import { BLANK_DRAFT, CURSORS, TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { generateId } from '@/utils/generateId'
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
      tool: TOOLS.BUCKET,
      shortcut: 'G'
    },
    {
      cursor: CURSORS[3],
      tool: TOOLS.ERASER,
      shortcut: 'E'
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
      <SaveHandler />
    </aside>
  )
}

const SaveHandler = () => {
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const setDraft = useCanvasStore(s => s.setDraftCanvas)

  const editingPixels = usePaintStore(s => s.pixels)
  const isDraft = editingCanvasId === null

  const generateNewCanvasId = (): string => {
    const generatedId = generateId()
    return savedCanvases.some(c => c.id === generatedId) ? generateNewCanvasId() : generatedId
  }

  const createNewSave = () => {
    const newCanvasId = generateNewCanvasId()

    const savingCanvas = {
      id: newCanvasId,
      pixels: editingPixels
    }
    setSavedCanvases([...savedCanvases, savingCanvas])
    setEditingCanvasId(newCanvasId)
  }

  const createNewDraft = () => {
    setEditingCanvasId(null)
    setDraft({
      ...BLANK_DRAFT,
      pixels: editingPixels
    })
  }

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
