import { useEffect, useRef, useState } from 'react'
import { colorComparison } from '@/utils/colorComparison'

interface Props {
  color: string
  index: number
}

export const Pixel = ({ color, index }: Props) => {
  const [showGrid, setShowGrid] = useState(true)
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

  return (
    <div
      className={`w-full aspect-square transition-all select-none ${outerPadding}`}
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
        {index}
      </div>
    </div>
  )
}
