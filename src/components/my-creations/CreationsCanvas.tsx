import { BLANK_DRAFT } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useContext, useMemo, useRef } from 'react'
import { CreationsContext } from '@/context/CreationsContext'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from '../CanvasImage'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { DMButton } from '../dialog-menu/DMButton'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'
import { DownloadPaintingsMenu } from './DownloadPaintingsMenu'

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
  const savedCanvasesRef = useFreshRefs(savedCanvases)

  const { isOnSelectionMode } = useContext(CreationsContext)
  const { openMenu } = useDialogMenu()

  const openCanvas = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    router.push('/paint')
  }

  const editCanvasesHelper = () => ({
    newCanvases: structuredClone(savedCanvasesRef.current),
    canvasIndex: savedCanvasesRef.current.findIndex(c => c.id === id)
  })

  const cloneCanvas = () => {
    const { newCanvases, canvasIndex } = editCanvasesHelper()
    const newCanvas = { ...newCanvases[canvasIndex], id: getNewCanvasId() }
    newCanvases.splice(canvasIndex + 1, 0, newCanvas)
    setSavedCanvases(newCanvases)
  }

  const deleteCanvas = () => {
    const deleteAction = () => {
      const { newCanvases, canvasIndex } = editCanvasesHelper()
      newCanvases.splice(canvasIndex, 1)
      setSavedCanvases(newCanvases)
    }

    openMenu(
      <>
        <DMHeader icon='warning'>Delete painting?</DMHeader>
        <DMParagraph className='w-xl'>
          Do you really want to delete your painting? You won't see it ever again (that's a long time).
        </DMParagraph>
        <DMZoneButtons>
          <DMButton icon='trash' empty onClick={deleteAction}>
            Yes, I don't care
          </DMButton>
          <DMButton>No, wait!</DMButton>
        </DMZoneButtons>
      </>
    )
  }

  const downloadPaintings = () => {
    openMenu(<DownloadPaintingsMenu canvasId={id} />)
  }

  const openFeatureNotImplemented = () =>
    openMenu(
      <>
        <DMHeader icon='code'>Feature not implemented yet :(</DMHeader>
        <DMButton>...Okay</DMButton>
      </>
    )

  useContextMenu({
    options: [
      {
        label: 'Edit',
        icon: 'pencil',
        action: openCanvas
      },
      {
        label: 'Publish',
        icon: 'heart',
        action: openFeatureNotImplemented
      },
      {
        label: 'Duplicate',
        icon: 'clone',
        action: cloneCanvas
      },
      {
        label: 'Download',
        icon: 'download',
        action: downloadPaintings
      },
      {
        label: 'Delete',
        icon: 'trash',
        action: deleteCanvas
      }
    ],
    ref: canvasRef,
    showWhen: !isDraft
  })

  const mainVisibility = !isVisible ? 'brightness-150 blur-[4px] scale-75 opacity-0' : ''
  const itemStyle = 'bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card'

  return (
    <li
      className={`
        button relative w-full aspect-square transition-all duration-300 
        ${mainVisibility}
      `}
      key={id}
      onClick={openCanvas}
      ref={canvasRef}
    >
      <CanvasImage className='size-full rounded-xl border-4 border-theme-10' dataUrl={dataUrl} />

      {/* Draft indicator */}
      {isDraft && (
        <span
          className={`
            absolute h-10 px-3 flex items-center text-2xl font-bold 
            left-[var(--creations-canvas-pad)] bottom-[var(--creations-canvas-pad)] 
            animate-appear text-theme-10 ${itemStyle}
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
            right-[var(--creations-canvas-pad)] bottom-[var(--creations-canvas-pad)] ${itemStyle}
          `}
        >
          <ColoredPixelatedImage icon='pencil' className='bg-theme-10 size-10 ' />
        </span>
      )}

      {/*Selection box*/}
      {isOnSelectionMode && <SelectionBox />}
    </li>
  )
}

// interface SelectionBoxProps {}

const SelectionBox = () => (
  <div
    className={`
      absolute right-[var(--creations-canvas-pad)] top-[var(--creations-canvas-pad)]
      size-12 border-2 border-theme-10/50 flex items-center justify-center
      bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card animate-appear
    `}
  >
    <ColoredPixelatedImage icon='check' className='size-full scale-110' />
  </div>
)
