import { Z_INDEX } from '@consts'
import { DMButton } from '@dialog-menu/DMButton'
import { DMDragNDrop } from '@dialog-menu/DMDragNDrop'
import { DMHeader } from '@dialog-menu/DMHeader'
import type { IconName, JSONCanvas, ReusableComponent, SavedCanvas } from '@types'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { CreationsContext } from '@/context/CreationsContext'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasStore } from '@/store/useCanvasStore'
import { canvasParser } from '@/utils/canvasParser'
import { generateId } from '@/utils/generateId'
import { CreationsHeaderButton } from './CreationsHeaderButton'
import { DeletePaintingsMenu } from './DeletePaintingsMenu'
import { DownloadPaintingsMenu } from './DownloadPaintingsMenu'

export const CreationsHeader = ({ className = '', ...props }: ReusableComponent) => {
  const { openMenu, closeMenu, menuIsOpen } = useDialogMenu()
  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const pushToSavedCanvases = useCanvasStore(s => s.pushToSavedCanvases)
  const hydrated = useCanvasStore(s => s.hydrated)

  const {
    selectedCanvases,
    isOnSelectionMode,
    enableSelectionMode,
    selectAllCanvases,
    deselectAllCanvases,
    disableSelectionMode
  } = useContext(CreationsContext)

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

  const onDropOrSelect = (contents: string[]) => {
    const jsonCanvases: JSONCanvas[] = []

    // Parse and contents into an one level array
    for (const content of contents) {
      try {
        const raw: JSONCanvas | JSONCanvas[] = JSON.parse(content)
        Array.isArray(raw) ? jsonCanvases.push(...raw) : jsonCanvases.push(raw)
      } catch (err) {
        console.error('Tried to import an invalid file!', err)
      }
    }

    // Filter valid imported canvases
    const replaceableId = generateId()
    const importedCanvases: SavedCanvas[] = jsonCanvases
      .map(c => canvasParser.fromStorage({ ...c, id: replaceableId }))
      .filter(c => !!c)

    // Log warning for invalid ones
    const invalidCanvasesCount = jsonCanvases.length - importedCanvases.length
    if (invalidCanvasesCount) {
      console.warn(
        `${invalidCanvasesCount} of the imported paintings were not valid so we are skipping them...`
      )
    }

    pushToSavedCanvases(...importedCanvases)
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

  const buttons: CreationsButtonType[] = isOnSelectionMode
    ? [
        {
          label: 'Exit selection',
          icon: 'cross',
          action: () => {
            deselectAllCanvases()
            disableSelectionMode()
          }
        },
        {
          label: 'Select all',
          icon: 'check',
          action: selectAllCanvases
        },
        {
          label: 'Download selected',
          icon: 'download',
          disabled: !selectedCanvases.length,
          action: () =>
            openMenu(
              <DownloadPaintingsMenu canvasesIds={selectedCanvases} onDownload={disableSelectionMode} />
            )
        },
        {
          label: 'Delete selected',
          icon: 'trash',
          disabled: !selectedCanvases.length,
          action: () =>
            openMenu(<DeletePaintingsMenu canvasesIds={selectedCanvases} onDelete={disableSelectionMode} />)
        }
      ]
    : [
        {
          label: 'Selection mode',
          icon: 'selection-mode',
          action: enableSelectionMode,
          disabled: savedCanvases.length < 2
        },
        {
          label: 'Import',
          icon: 'upload',
          action: openImportMenu
        }
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
      {hydrated && buttons.map((button, i) => <CreationsHeaderButton {...button} key={i} index={i} />)}
    </header>
  )
}

export interface CreationsButtonType {
  label: string
  icon: IconName
  action?: () => void
  disabled?: boolean
}
