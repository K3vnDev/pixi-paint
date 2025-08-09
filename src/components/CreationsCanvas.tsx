import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { BLANK_DRAFT } from '@/consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { CanvasImage } from './CanvasImage'

export const CreationsCanvas = ({ id, dataUrl, isVisible }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)

  const handleClick = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    router.push('/paint')
  }

  const visibility = !isVisible ? 'brightness-150 blur-[4px] scale-75 opacity-0' : ''

  return (
    <li
      className={`
       button relative w-full aspect-square
        transition-all duration-300 ${visibility}
      `}
      key={id}
      onClick={handleClick}
    >
      {id === 'draft' && (
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
