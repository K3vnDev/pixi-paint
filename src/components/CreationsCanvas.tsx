import { BLANK_DRAFT } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from './CanvasImage'

export const CreationsCanvas = ({ id, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const canvasRef = useRef<HTMLLIElement>(null)
  const isDraft = id === 'draft'

  const openCanvas = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    router.push('/paint')
  }
  const visibility = !isVisible ? 'brightness-150 blur-[4px] scale-75 opacity-0' : ''

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
        action: () => {}
      },
      {
        label: 'Download',
        icon: 'download',
        action: () => {}
      },
      {
        label: 'Delete',
        icon: 'trash',
        action: () => {}
      }
    ],
    ref: canvasRef,
    showWhen: !isDraft
  })

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
