'use client'

import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'

export default function Home() {
  useBasicPrevention()
  const { savedCanvases } = useSaveCanvases()

  return (
    <main className='mt-32 w-screen flex flex-col justify-center items-center relative'>
      <h2 className='text-white font-bold text-2xl'>MY CREATIONS</h2>
      <ul className='grid grid-cols-5'>
        {savedCanvases.map(({ id }) => (
          <li className='h-12 bg-green-300 rounded-xl px-4' key={id}>
            Item saved with id {id}
          </li>
        ))}
      </ul>
    </main>
  )
}
