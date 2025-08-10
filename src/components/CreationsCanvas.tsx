import { BLANK_DRAFT } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useFreshRef } from '@/hooks/useFreshRef'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from './CanvasImage'

export const CreationsCanvas = ({ id, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const canvasRef = useRef<HTMLLIElement>(null)
  const isDraft = id === 'draft'

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)

  const savedCanvasesRef = useFreshRef(savedCanvases)

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
    const { newCanvases, canvasIndex } = editCanvasesHelper()
    newCanvases.splice(canvasIndex, 1)
    setSavedCanvases(newCanvases)
  }

  useContextMenu({
    options: [
      {
        label: 'Edit',
        icon: 'pencil',
        action: openCanvas
      },
      {
        label: 'Duplicate',
        icon: 'clone',
        action: cloneCanvas
      },
      {
        label: 'Download',
        icon: 'download',
        action: () => {}
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

  const visibility = !isVisible ? 'brightness-150 blur-[4px] scale-75 opacity-0' : ''

  return (
    <li
      className={`
        button relative w-full aspect-square transition-all duration-300 ${visibility}
      `}
      key={id}
      onClick={openCanvas}
      ref={canvasRef}
    >
      {isDraft && (
        <span
          className={`
            absolute text-black font-bold bg-white px-5 py-1 rounded-sm text-3xl 
            bottom-1 left-1/2 -translate-1/2
          `}
        >
          DRAFT
        </span>
      )}
      <CanvasImage className='size-full rounded-xl border-4 border-theme-10' dataUrl={dataUrl} />
    </li>
  )
}
