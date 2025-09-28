import { useEffect, useRef, useState } from 'react'
import { useTimeout } from '@/hooks/timer-handlers/useTimeout'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { colorComparison } from '@/utils/colorComparison'

interface Props {
  color: string
  index: number
  isVisible: boolean
}

export const Pixel = ({ color, index, isVisible }: Props) => {
  const showGrid = useCanvasesStore(s => s.showGrid)
  const [outerPadding, innerRoundness] = showGrid ? ['p-[2px]', 'rounded-[1px]'] : ['', '']

  const prevColor = useRef(color)
  const [animClassName, setAnimClassName] = useState('')

  const isOnAnimation = useRef(false)
  const { startTimeout, stopTimeout } = useTimeout([], () => {
    setAnimClassName('')
    isOnAnimation.current = false
  })

  const ANIM = {
    TIME: 200,
    NAME: 'pixel-anim'
  }

  useEffect(() => {
    if (!colorComparison(prevColor.current, color) && !isOnAnimation.current) {
      isOnAnimation.current = true
      setAnimClassName(ANIM.NAME)
      startTimeout(stopTimeout, ANIM.TIME)
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
