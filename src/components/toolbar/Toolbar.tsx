'use client'

import { CURSORS, SPRITES_SIZE, TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import { SaveHandler } from './SaveHandler'
import { Separator } from './Separator'
import { Tool } from './Tool'

export const ToolBar = () => {
  const { media } = useResponsiveness()
  const spriteSize = media.lg ? SPRITES_SIZE : media.md ? 72 : media.sm ? 64 : 56

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
    <aside
      className={`
        absolute lg:gap-3 sm:gap-2 gap-1.5 animate-slide-in-left 
        lg:left-[var(--sidebar-margin)] not-lg:bottom-[var(--sidebar-margin)]
        flex lg:flex-col justify-center
        lg:w-fit w-[var(--w-screen-minus-pad)]
      `}
    >
      {tools.map(tool => (
        <Tool {...tool} key={tool.tool} spriteSize={spriteSize} />
      ))}

      {media.lg && <Separator />}

      <SaveHandler spriteSize={spriteSize} />
    </aside>
  )
}
