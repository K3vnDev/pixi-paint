import { BLANK_DRAFT, CANVASES_TRANSITION_MS as CANVASES_TRANSITION_DURATION, HTML_DATA_IDS } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useContext, useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { CreationsContext, type DraggingSelection } from '@/context/CreationsContext'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useGridCanvasStyles } from '@/hooks/useGridCanvasStyles'
import { usePressed } from '@/hooks/usePressed'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from '../CanvasImage'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { DeletePaintingsMenu } from './DeletePaintingsMenu'
import { DownloadPaintingsMenu } from './DownloadPaintingsMenu'
import { PublishPaintingMenu } from './PublishPaintingMenu'
import { SelectionBox } from './SelectionBox'

export const CreationsCanvas = ({ id, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const canvasRef = useRef<HTMLLIElement>(null)
  const editingCavasId = useCanvasStore(s => s.editingCanvasId)

  const isDraft = useMemo(() => id === 'draft', [])
  const isCurrentlyEditing = useMemo(() => (isDraft && editingCavasId === null) || editingCavasId === id, [])

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)

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

  const refs = useFreshRefs({ savedCanvases, draggingSelection, isOnSelectionMode, canvasIsSelected })

  const { openMenu } = useDialogMenu()
  const { isPressed } = usePressed({
    ref: canvasRef,
    onPressStart: () => {
      const { isOnSelectionMode, canvasIsSelected, draggingSelection } = refs.current
      if (!isOnSelectionMode) return

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

  const cloneCanvas = () => {
    const newCanvases = structuredClone(refs.current.savedCanvases)
    const canvasIndex = newCanvases.findIndex(c => c.id === id)

    const newCanvas = { ...newCanvases[canvasIndex], id: getNewCanvasId() }
    newCanvases.splice(canvasIndex + 1, 0, newCanvas)
    setSavedCanvases(newCanvases)
  }

  const openDeletePaintingsMenu = () => {
    openMenu(<DeletePaintingsMenu canvasesIds={[id]} />)
  }

  const openDownloadPaintingsMenu = () => {
    openMenu(<DownloadPaintingsMenu canvasesIds={[id]} />)
  }

  const openPublishPaintingMenu = () => {
    openMenu(<PublishPaintingMenu canvasId={id} dataUrl={dataUrl} />)
  }

  useContextMenu({
    options: [
      {
        label: 'Edit',
        icon: 'pencil',
        action: openCanvas
      },
      {
        label: 'Publish',
        icon: 'publish',
        action: openPublishPaintingMenu
      },
      {
        label: 'Duplicate',
        icon: 'clone',
        action: cloneCanvas
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
    ],
    ref: canvasRef,
    showWhen: !isDraft && !isOnSelectionMode
  })

  const handleClick = () => {
    !isOnSelectionMode && openCanvas()
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

      {/* Draft indicator */}
      {isDraft && (
        <span
          className={`
            absolute h-10 px-3 flex items-center text-2xl font-bold 
            left-[var(--creations-canvas-pad)] bottom-[var(--creations-canvas-pad)] 
            animate-appear text-theme-10 ${classNameStyles.canvasItem}
          `}
        >
          DRAFT
        </span>
      )}

      {/* Editing indicator */}
      {isCurrentlyEditing && (
        <span
          className={`
            absolute ml-auto animate-appear opacity-100 
            right-[var(--creations-canvas-pad)] bottom-[var(--creations-canvas-pad)] ${classNameStyles.canvasItem}
          `}
        >
          <ColoredPixelatedImage icon='pencil' className='bg-theme-10 size-10' />
        </span>
      )}

      {/*Selection box*/}
      {isOnSelectionMode && <SelectionBox {...{ canvasIsSelected }} />}
    </li>
  )
}
