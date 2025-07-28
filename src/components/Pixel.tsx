import { useState } from 'react'

interface Props {
  color: string
  index: number
}

export const Pixel = ({ color, index }: Props) => {
  const [showGrid, setShowGrid] = useState(true)
  const [outerPadding, innerRoundness] = showGrid ? ['p-[2px]', 'rounded-[1px]'] : ['', '']

  return (
    <div
      className={`w-full aspect-square cursor-pointer transition-all select-none ${outerPadding}`}
      draggable={false}
      data-pixel-index={index}
    >
      <div className={`size-full pointer-events-none ${innerRoundness}`} style={{ background: color }}>
        {index}
      </div>
    </div>
  )
}
