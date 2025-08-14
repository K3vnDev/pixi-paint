import type { ReusableComponent } from '@types'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ColoredPixelatedImage } from '@/components/ColoredPixelatedImage'
import { useFreshRef } from '@/hooks/useFreshRef'

interface Props {
  initialColor: string
  parentRef: ReusableComponent['ref']
}

export const Picker = ({ initialColor, parentRef }: Props) => {
  const [colorPickerColor, setColorPickerColor] = useState(initialColor)
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: '0px', top: '0px' })

  const isOpenRef = useFreshRef(isOpen)

  useEffect(() => {
    const parent: HTMLElement = parentRef?.current

    const handlePointerUp = (e: PointerEvent) => {
      if (clickedInside(e) && !isOpenRef.current) {
        open()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!clickedInside(e)) close()
    }

    const clickedInside = (e: PointerEvent) => {
      if (!parent || !elementRef.current) return false
      const target = e.target as HTMLElement
      return parent.contains(target) || elementRef.current.contains(target)
    }

    document.addEventListener('pointerup', handlePointerUp, { capture: true })
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })

    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const open = () => {
    if (!parentRef?.current || !elementRef.current) return

    const elementRect = elementRef.current.getBoundingClientRect()
    const parentRect = (parentRef.current as HTMLElement).getBoundingClientRect()

    const margin = 28
    const left = -elementRect.width - margin
    const top = parentRect.height / 2 - elementRect.height / 2

    setPosition({ left: `${left}px`, top: `${top}px` })
    console.log({ left, top })
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const style = isOpen ? '' : 'opacity-0'

  return (
    <span
      className={`
        fixed px-5 py-6 bg-theme-50 border-2 border-theme-20 rounded-xl
        ${style} transition-all origin-right z-50 shadow-card flex flex-col gap-4 w-min
      `}
      ref={elementRef}
      style={{ ...position }}
    >
      <HexColorPicker color={colorPickerColor} onChange={setColorPickerColor} />
      <label
        className={`
          bg-black/50 rounded-md border-2 border-theme-20/50 outline-none 
          focus-within:border-theme-20 focus-within:shadow-md focus-within:shadow-theme-20/30
          flex justify-between w-full
        `}
      >
        <input value={colorPickerColor} className='outline-none text-xl text-theme-10 w-full px-3 py-1 ' />
        <button className='w-fit h-full flex items-center px-2 py-1 button'>
          <ColoredPixelatedImage icon='clone' className='bg-theme-10 size-8 scale-110' />
        </button>
      </label>

      <div
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+1px)] rotate-45 size-8 rounded-tr-sm
          bg-theme-50 border-t-2 border-r-2 border-theme-20 -z-10
        `}
      />
    </span>
  )
}
