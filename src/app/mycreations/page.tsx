'use client'

import { useBasicPrevention } from '@/hooks/useBasicPrevention'

export default function Home() {
  useBasicPrevention()

  return (
    <main className='w-screen h-dvh flex justify-center items-center relative'>
      <h1 className='text-white'>USER CREATIONS WILL GO HERE</h1>
    </main>
  )
}
