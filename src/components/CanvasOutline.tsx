import type { ReusableComponent } from '@types'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useCanvasesStore } from '@/store/useCanvasesStore'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const CanvasOutline = ({ children, className = '' }: Props) => {
  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const [backgroundSize, setBackgroundSize] = useState(BG_SIZES.HIDDEN)

  useEffect(() => {
    const isDraft = editingCanvasId === null
    setBackgroundSize(isDraft ? BG_SIZES.HIDDEN : BG_SIZES.SHOWN)
  }, [editingCanvasId])

  return (
    <div
      className={twMerge(`
        size-[calc(var(--canvas-size)+(var(--canvas-outline-w)*2))]
        overflow-clip rounded-2xl relative 
        flex justify-center items-center p-[calc(var(--canvas-outline-w)*0.4)] ${className} 
      `)}
    >
      <div
        className={`
          bg-gradient-to-r from-theme-10 to-theme-20 ${backgroundSize}
          -z-10 absolute rounded-full blur-sm transition-all ease-in-out
          top-1/2 left-1/2 -translate-1/2 animate-spin pointer-events-none
        `}
      />
      <div
        className={`
          size-full flex justify-center items-center 
          bg-theme-bg rounded-xl
        `}
      >
        {children}
      </div>
    </div>
  )
}

const BG_SIZES = {
  HIDDEN: 'size-[70%] duration-1200',
  SHOWN: 'size-[150%] duration-2100'
}
