'use client'

import { useRouter } from 'next/navigation'
import { CanvasImage } from '@/components/CanvasImage'
import { BLANK_DRAFT } from '@/consts'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import type { SavedCanvas as SavedCanvasType } from '@/types'

export default function Home() {
  useBasicPrevention()
  const { savedCanvases, draft } = useSaveCanvases()

  return (
    <main className='mt-32 w-screen flex flex-col gap-8 justify-center items-center relative'>
      <h2 className='text-white font-bold text-2xl'>MY CREATIONS</h2>
      <ul className='grid grid-cols-5 gap-5'>
        <div className='text-white'>
          DRAFT
          <SavedCanvas {...draft} />
        </div>
        {savedCanvases.map(({ id, pixels }) => (
          <SavedCanvas key={id} {...{ id, pixels }} />
        ))}
      </ul>
    </main>
  )
}

type SavedCanvasProps = {
  isDraft?: boolean
} & SavedCanvasType

const SavedCanvas = ({ id, pixels }: SavedCanvasProps) => {
  const router = useRouter()
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const setCanvas = usePaintStore(s => s.setPixels)

  const handleClick = () => {
    const newEditingCanvasId = id === BLANK_DRAFT.id ? null : id
    setEditingCanvasId(newEditingCanvasId)
    setCanvas(pixels)
    router.push('/paint')
  }

  return (
    <li className='p-4 bg-white rounded-xl button' key={id} onClick={handleClick}>
      <CanvasImage className='size-64' pixels={pixels} />
    </li>
  )
}
