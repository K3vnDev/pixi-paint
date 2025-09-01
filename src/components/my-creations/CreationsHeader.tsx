import { DMButton } from '@@/dialog-menu/DMButton'
import { DMDragNDrop } from '@@/dialog-menu/DMDragNDrop'
import { DMHeader } from '@@/dialog-menu/DMHeader'
import { Z_INDEX } from '@consts'
import type { IconName, JSONCanvas, ReusableComponent, SavedCanvas } from '@types'
import { twMerge } from 'tailwind-merge'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasStore } from '@/store/useCanvasStore'
import { canvasParser } from '@/utils/canvasParser'
import { generateId } from '@/utils/generateId'
import { CreationsHeaderButton } from './CreationsHeaderButton'

export const CreationsHeader = ({ className = '', ...props }: ReusableComponent) => {
  const { openMenu, closeMenu, menuIsOpen } = useDialogMenu()
  const addToSavedCanvases = useCanvasStore(s => s.addToSavedCanvases)

  useEvent(
    'dragenter',
    (e: DragEvent) => {
      if (!menuIsOpen) {
        e.stopPropagation()
        openImportMenu()
      }
    },
    { deps: [menuIsOpen] }
  )

  // TODO: Validate with zod
  const onDropOrSelect = (contents: string[]) => {
    const jsonCanvases: JSONCanvas[] = []

    // Parse and contents into an one level array
    for (const content of contents) {
      const raw: JSONCanvas | JSONCanvas[] = JSON.parse(content)
      Array.isArray(raw) ? jsonCanvases.push(...raw) : jsonCanvases.push(raw)
    }

    const replaceableId = generateId()
    const importedCanvases: SavedCanvas[] = jsonCanvases
      .map(c => canvasParser.fromStorage({ ...c, id: replaceableId }))
      .filter(c => !!c)

    addToSavedCanvases(...importedCanvases)
    closeMenu()
  }

  const openImportMenu = () =>
    openMenu(
      <>
        <DMHeader icon='code' className='border-none mb-0'>
          Paintings importer
        </DMHeader>
        <DMDragNDrop
          className='w-128 my-1 px-10'
          acceptedFormats={['application/json']}
          allowMultipleFiles
          {...{ onDropOrSelect }}
        >
          Drag & Drop compatible JSON files here, or click to choose...
        </DMDragNDrop>
        <DMButton icon='cross' empty className='mt-4'>
          Nah, I'm good
        </DMButton>
      </>
    )

  const buttons: CreationsButtonType[] = [
    {
      label: 'Import',
      icon: 'upload',
      action: openImportMenu
    },
    { label: 'Selection mode', icon: 'check' }
  ]

  return (
    <header
      className={twMerge(`
        fixed w-full left-0 top-[var(--navbar-height)] backdrop-blur-md ${Z_INDEX.NAVBAR}
        bg-gradient-to-b from-25% from-theme-bg to-theme-bg/60
        flex gap-5 py-6 px-[var(--galery-pad-x)] border-theme-20/50 ${className}
      `)}
      {...props}
    >
      {buttons.map((button, i) => (
        <CreationsHeaderButton {...button} key={i} index={i} />
      ))}
    </header>
  )
}

export interface CreationsButtonType {
  label: string
  icon: IconName
  action?: () => void
}
