import { BLANK_DRAFT, CANVASES_TRANSITION_MS as CANVASES_TRANSITION_DURATION, HTML_DATA_IDS } from '@consts'
import type { ContextMenuOption, GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useContext, useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { CreationsContext, type DraggingSelection } from '@/context/CreationsContext'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useGridCanvasStyles } from '@/hooks/useGridCanvasStyles'
import { useHold } from '@/hooks/useHold'
import { usePressed } from '@/hooks/usePressed'
import { useTouchChecking } from '@/hooks/useTouchChecking'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { CanvasImage } from '../CanvasImage'
import { DeletePaintingsMenu } from '../dialog-menu/premade-menus/DeletePaintingsMenu'
import { DownloadPaintingsMenu } from '../dialog-menu/premade-menus/DownloadPaintingsMenu'
import { PublishPaintingMenu } from '../dialog-menu/premade-menus/PublishPaintingMenu'
import { SharePaintingMenu } from '../dialog-menu/premade-menus/SharePaintingMenu'
import { CreationCanvasIndicator } from './CreationCanvasIndicator'
import { SelectionBox } from './SelectionBox'

export const CreationsCanvas = ({ id, pixels, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)
  const canvasRef = useRef<HTMLLIElement>(null)
  const editingCavasId = useCanvasesStore(s => s.editingCanvasId)

  const isDraft = useMemo(() => id === 'draft', [])
  const isCurrentlyEditing = useMemo(() => (isDraft && editingCavasId === null) || editingCavasId === id, [])

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasesStore(s => s.getNewCanvasId)

  const userPublishedCanvasesIds = useRemoteStore(s => s.userPublishedIds)
  const setUserPublishedCanvasesIds = useRemoteStore(s => s.setUserPublishedIds)

  const isPublished = useMemo(() => !!userPublishedCanvasesIds?.has(id), [userPublishedCanvasesIds])

  const {
    isOnSelectionMode: isOnGlobalSelectionMode,
    isCanvasSelected,
    selectCanvas,
    deselectCanvas,
    toggleCanvas,
    draggingSelection,
    setDraggingSelection
  } = useContext(CreationsContext)

  const isOnSelectionMode = isOnGlobalSelectionMode && !isDraft
  const canvasIsSelected = isOnSelectionMode && isCanvasSelected(id)
  const isDisabled = !isVisible || (isOnGlobalSelectionMode && isDraft)
  const isUsingTouch = useTouchChecking()

  const refs = useFreshRefs({
    savedCanvases,
    draggingSelection,
    isOnSelectionMode,
    canvasIsSelected,
    isUsingTouch
  })

  const { openMenu } = useDialogMenu()
  const { isPressed } = usePressed({
    ref: canvasRef,
    onPressStart: () => {
      const { isOnSelectionMode, canvasIsSelected, draggingSelection, isUsingTouch } = refs.current
      if (!isOnSelectionMode || isUsingTouch) return

      if (draggingSelection) {
        draggingSelection === 'selecting' ? selectCanvas(id) : deselectCanvas(id)
        return
      }
      const newDraggingSelection: DraggingSelection = canvasIsSelected ? 'deselecting' : 'selecting'
      setDraggingSelection(newDraggingSelection)
      toggleCanvas(id)
    }
  })

  useEvent(
    'pointerup',
    () => {
      if (refs.current.isOnSelectionMode) {
        setDraggingSelection(null)
      }
    },
    { capture: true }
  )

  const { classNameStyles } = useGridCanvasStyles({ isVisible, isPressed, isDisabled })

  const openCanvas = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    router.push('/paint')
  }

  const duplicateCanvas = () => {
    const canvasIndex = savedCanvases.findIndex(c => c.id === id)
    if (canvasIndex === -1) return

    // Create and add new canvas
    const nextCanvasIndex = canvasIndex + 1
    const newCanvas = { ...savedCanvases[canvasIndex], id: getNewCanvasId() }

    setSavedCanvases(c => {
      c.splice(nextCanvasIndex, 0, newCanvas)
      return c
    })

    // Add new id to user published canvases ids
    requestAnimationFrame(() => {
      const { id } = refs.current.savedCanvases[nextCanvasIndex]
      setUserPublishedCanvasesIds(ids => ids?.add(id))
    })
  }

  const openDeletePaintingsMenu = () => {
    openMenu(<DeletePaintingsMenu canvasesIds={[id]} />)
  }

  const openDownloadPaintingsMenu = () => {
    openMenu(<DownloadPaintingsMenu canvasesIds={[id]} />)
  }

  const openPublishPaintingMenu = () => {
    openMenu(<PublishPaintingMenu {...{ canvasId: id, canvasRef, dataUrl }} />)
  }

  const openSharePaintingMenu = () => {
    openMenu(<SharePaintingMenu {...{ dataUrl, pixels, localCanvasId: id }} />)
  }

  const publishOrShareOption: ContextMenuOption = isPublished
    ? {
        label: 'Share',
        icon: 'share',
        action: openSharePaintingMenu
      }
    : {
        label: 'Publish',
        icon: 'publish',
        action: openPublishPaintingMenu
      }

  const { openMenu: openCtxMenu } = useContextMenu({
    ref: canvasRef,
    showWhen: !isDraft && !isOnSelectionMode,
    options: [
      {
        label: 'Edit',
        icon: 'pencil',
        action: openCanvas
      },
      publishOrShareOption,
      {
        label: 'Duplicate',
        icon: 'clone',
        action: duplicateCanvas
      },
      {
        label: 'Download',
        icon: 'download',
        action: openDownloadPaintingsMenu
      },
      {
        label: 'Delete',
        icon: 'trash',
        action: openDeletePaintingsMenu
      }
    ]
  })

  useHold({
    ref: canvasRef,
    onHold: e => {
      if (refs.current.isOnSelectionMode) {
        toggleCanvas(id)
        return
      }

      const [{ clientX, clientY }] = e.touches
      openCtxMenu(clientX, clientY)
    },
    onCancel: ({ cancelledFromMove }) => {
      if (cancelledFromMove) return

      // biome-ignore format: <>
      refs.current.isOnSelectionMode 
        ? toggleCanvas(id) 
        : openCanvas()
    }
  })

  const handleClick = () => {
    !isUsingTouch && openCanvas()
  }

  const selectedStyle =
    canvasIsSelected || !isOnSelectionMode ? 'border-theme-10' : 'border-theme-10/10 brightness-70'

  return (
    <li
      className={twMerge(`
        relative w-full aspect-square transition-all ${HTML_DATA_IDS.CREATION_CANVAS_TARGET}
        ${classNameStyles.canvasState}
      `)}
      key={id}
      onClick={handleClick}
      ref={canvasRef}
      style={{ transitionDuration: `${CANVASES_TRANSITION_DURATION}ms` }}
    >
      <CanvasImage className={`size-full rounded-xl border-4 ${selectedStyle}`} dataUrl={dataUrl} />

      {/* Indicators */}
      <div
        className={`
          absolute w-full p-[var(--creations-canvas-pad)] 
          pt-0 flex items-center bottom-0
        `}
      >
        {isDraft && <CreationCanvasIndicator className='px-3'>DRAFT</CreationCanvasIndicator>}
        {userPublishedCanvasesIds !== undefined && (
          <div className='flex ml-auto gap-2.5'>
            {isCurrentlyEditing && <CreationCanvasIndicator icon='pencil' />}
            {isPublished && <CreationCanvasIndicator icon='heart' />}
          </div>
        )}
      </div>

      {/*Selection box*/}
      {isOnSelectionMode && <SelectionBox {...{ canvasIsSelected }} />}
    </li>
  )
}
