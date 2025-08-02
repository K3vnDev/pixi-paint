import { useEffect, useRef, useState } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { colorComparison } from '@/utils/colorComparison'

interface Props {
  color: string
  index: number
  isVisible: boolean
}

export const Pixel = ({ color, index, isVisible }: Props) => {
  const showGrid = useCanvasStore(s => s.showGrid)
  const [outerPadding, innerRoundness] = showGrid ? ['p-[2px]', 'rounded-[1px]'] : ['', '']

  const prevColor = useRef(color)
  const [animClassName, setAnimClassName] = useState('')

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ANIM = {
    TIME: 200,
    NAME: 'pixel-anim'
  }

  useEffect(() => {
    if (!colorComparison(prevColor.current, color) && !timeout.current) {
      setAnimClassName(ANIM.NAME)

      timeout.current = setTimeout(() => {
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
          setAnimClassName('')
        }
      }, ANIM.TIME)
    }
    prevColor.current = color
  }, [color])

  const visibility = isVisible ? '' : 'scale-50 opacity-0 brightness-150'

  return (
    <div
      className={`w-full aspect-square transition-all select-none ${outerPadding} ${visibility}`}
      draggable={false}
      data-pixel-index={index}
    >
      <div
        className={`
          size-full pointer-events-none transition-colors duration-[50ms]
          ${innerRoundness} ${animClassName}
        `}
        style={{ background: color }}
      >
        {/* {index} */}
      </div>
    </div>
  )
}
