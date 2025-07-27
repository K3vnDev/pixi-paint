'use client'

import { MODES } from '@consts'
import type { ToolbarItem } from '@types'
import { useSaveCanvas } from '@/hooks/useSaveCanvas'
import { usePaintStore } from '@/store/usePaintStore'

export const ToolBar = () => {
  const items: ToolbarItem[] = [
    {
      name: 'Paint',
      mode: MODES.PAINT
    },
    {
      name: 'Erase',
      mode: MODES.ERASE
    }
  ]

  return (
    <aside className='absolute flex flex-col left-8 gap-4'>
      {items.map(item => (
        <Item {...item} key={item.mode} />
      ))}
      <SaveState />
    </aside>
  )
}

const Item = ({ name, mode }: ToolbarItem) => {
  const setMode = usePaintStore(s => s.setMode)
  const selectedMode = usePaintStore(s => s.mode)

  const handleClick = () => {
    setMode(mode)
  }

  const outline = selectedMode === mode ? 'outline-4 outline-white' : ''

  return (
    <button className={`bg-blue-400 size-24 button ${outline}`} onClick={handleClick}>
      {name}
    </button>
  )
}

const SaveState = () => {
  const { isDraft, newSave, newDraft } = useSaveCanvas()

  const handleClick = () => {
    if (isDraft) {
      newSave()
    } else {
      newDraft()
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
