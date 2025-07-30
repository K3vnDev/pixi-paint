'use client'

import { BLANK_DRAFT } from '@consts'
import type { GalleryCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { CanvasImage } from '@/components/CanvasImage'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useCanvasStore } from '@/store/useCanvasStore'

export default function Home() {
  useBasicPrevention()
  const { savedCanvases, draft, hydrated } = useSaveCanvases()
  const { canvasesGallery } = useCanvasesGallery({
    canvases: [draft, ...savedCanvases],
    loaded: hydrated
  })

  return (
    <main className='mt-32 w-screen flex flex-col gap-8 justify-center items-center relative'>
      <h2 className='text-white font-bold text-2xl'>MY CREATIONS</h2>
      <ul className='grid grid-cols-5 gap-5 pb-20'>
        {hydrated && canvasesGallery.map(({ id, dataUrl }) => <SavedCanvas key={id} {...{ id, dataUrl }} />)}
      </ul>
    </main>
  )
}

const SavedCanvas = ({ id, dataUrl }: GalleryCanvas) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)

  const handleClick = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    router.push('/paint')
  }

  return (
    <li className='p-4 bg-white rounded-xl button animate-appear relative' key={id} onClick={handleClick}>
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
      <CanvasImage className='size-64' dataUrl={dataUrl} />
    </li>
  )
}
