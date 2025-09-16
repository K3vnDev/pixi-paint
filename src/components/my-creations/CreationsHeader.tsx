import type { IconName, ReusableComponent } from '@types'
import { useContext } from 'react'
import { CreationsContext } from '@/context/CreationsContext'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { CanvasesGridHeader } from '../canvases-grid/CanvasesGridHeader'
import { CreationsHeaderButton } from './CreationsHeaderButton'
import { DeletePaintingsMenu } from './DeletePaintingsMenu'
import { DownloadPaintingsMenu } from './DownloadPaintingsMenu'
import { ImportPaintingsMenu } from './ImportPaintingsMenu'

export const CreationsHeader = ({ className = '', ...props }: ReusableComponent) => {
  const { openMenu, closeMenu, menuIsOpen } = useDialogMenu()
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const hydrated = useCanvasesStore(s => s.hydrated)

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
        openImportPaintingsMenu()
      }
    },
    { deps: [menuIsOpen] }
  )

  const openImportPaintingsMenu = () => openMenu(<ImportPaintingsMenu {...{ closeMenu }} />)

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
          action: openImportPaintingsMenu
        }
      ]

  return (
    <CanvasesGridHeader {...props}>
      {hydrated && buttons.map((button, i) => <CreationsHeaderButton {...button} key={i} index={i} />)}
    </CanvasesGridHeader>
  )
}

export interface CreationsButtonType {
  label: string
  icon: IconName
  action?: () => void
  disabled?: boolean
}
