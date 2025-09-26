import type { IconName, ReusableComponent } from '@types'
import { useCallback, useContext, useEffect } from 'react'
import { CreationsContext } from '@/context/CreationsContext'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { CanvasesGridHeader } from '../canvases-grid/CanvasesGridHeader'
import { DeletePaintingsMenu } from '../dialog-menu/premade-menus/DeletePaintingsMenu'
import { DownloadPaintingsMenu } from '../dialog-menu/premade-menus/DownloadPaintingsMenu'
import { ImportPaintingsMenu } from '../dialog-menu/premade-menus/ImportPaintingsMenu'
import { CreationsHeaderButton } from './CreationsHeaderButton'

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
    disableSelectionMode,
    setHasTallHeader
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

  const refreshTallHeaderValue = useCallback(() => {
    requestAnimationFrame(() => {
      const headerEl = props.ref?.current as HTMLElement
      if (!headerEl) return

      const childButtons = headerEl.querySelectorAll('button')
      let lastTop = -1
      let hasMultipleRows = false

      for (const btn of childButtons) {
        const { top } = btn.getBoundingClientRect()

        if (lastTop === -1) {
          lastTop = top
          continue
        }

        if (Math.abs(top - lastTop) > 20) {
          hasMultipleRows = true
          break
        }
      }
      setHasTallHeader(hasMultipleRows)
    })
  }, [])

  useEvent('resize', refreshTallHeaderValue, { target: 'window' })
  useEffect(() => {
    if (isOnSelectionMode) {
      refreshTallHeaderValue()
      return
    }
    setHasTallHeader(false)
  }, [isOnSelectionMode])

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
          label: 'Download',
          icon: 'download',
          disabled: !selectedCanvases.length,
          action: () =>
            openMenu(
              <DownloadPaintingsMenu canvasesIds={selectedCanvases} onDownload={disableSelectionMode} />
            )
        },
        {
          label: 'Delete',
          icon: 'trash',
          disabled: !selectedCanvases.length,
          action: () =>
            openMenu(<DeletePaintingsMenu canvasesIds={selectedCanvases} onDelete={disableSelectionMode} />)
        }
      ]
    : [
        {
          label: 'Selection',
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
    <CanvasesGridHeader className='flex lg:gap-5 gap-3 flex-wrap' {...props}>
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
