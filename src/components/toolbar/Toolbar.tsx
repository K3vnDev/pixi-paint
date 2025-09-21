'use client'

import { CURSORS, TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { SaveHandler } from './SaveHandler'
import { Separator } from './Separator'
import { Tool } from './Tool'

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

  return null

  return (
    <aside className='absolute flex flex-col left-[var(--sidebar-margin)] gap-3 animate-slide-in-left'>
      {tools.map(tool => (
        <Tool {...tool} key={tool.tool} />
      ))}
      <Separator />
      <SaveHandler />
    </aside>
  )
}
