import { BLANK_DRAFT } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from './CanvasImage'
import { ColoredPixelatedImage } from './ColoredPixelatedImage'
import { DMButton } from './dialog-menu/DMButton'
import { DMHeader } from './dialog-menu/DMHeader'
import { DMParagraph } from './dialog-menu/DMParagraph'
import { DMZoneButtons } from './dialog-menu/DMZoneButtons'

export const CreationsCanvas = ({ id, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const canvasRef = useRef<HTMLLIElement>(null)
  const editingCavasId = useCanvasStore(s => s.editingCanvasId)

  const isDraft = id === 'draft'
  const isCurrentlyEditing = (isDraft && editingCavasId === null) || editingCavasId === id

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)
  const savedCanvasesRef = useFreshRefs(savedCanvases)

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

  const openFeatureNotImplemented = () =>
    openMenu(
      <>
        <DMHeader>Feature not implemented yet :(</DMHeader>
        <DMButton>Okay...</DMButton>
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
        action: openFeatureNotImplemented
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
  const editingIndicatorVisibility = isCurrentlyEditing ? '' : 'opacity-0'

  return (
    <li
      className={`
        button relative w-full aspect-square transition-all duration-300 ${mainVisibility}
      `}
      key={id}
      onClick={openCanvas}
      ref={canvasRef}
    >
      <div
        className={`
          absolute w-full left-0 bottom-0 p-3.5 text-theme-10 flex 
          *:bg-theme-bg/80 *:backdrop-blur-xs *:rounded-md
        `}
      >
        {isDraft && <span className='h-10 px-3 flex items-center text-2xl font-bold'>DRAFT</span>}
        <span className={`ml-auto ${editingIndicatorVisibility} transition delay-1000`}>
          <ColoredPixelatedImage icon='pencil' className='bg-theme-10 size-10 ' />
        </span>
      </div>
      <CanvasImage className='size-full rounded-xl border-4 border-theme-10' dataUrl={dataUrl} />
    </li>
  )
}
