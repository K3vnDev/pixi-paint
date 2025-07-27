import { MODES } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'

export const Colorbar = () => {
  const colors = [
    '#FF0000', // red
    '#FF7F00', // orange
    '#FFFF00', // yellow
    '#00FF00', // green
    '#0000FF', // blue
    '#4B0082', // indigo
    '#8B00FF', // violet
    '#FF1493' // pink (extra)
  ]

  // red
  // pink
  // orange
  // yellow
  // light green
  // dark green
  // light blue
  // dark blue
  // purple
  // white
  // black
  // brown

  return (
    <aside className='flex flex-col gap-2 absolute right-8'>
      {colors.map(col => (
        <Color color={col} key={col} />
      ))}
    </aside>
  )
}

interface ColorProps {
  color: string
}

const Color = ({ color }: ColorProps) => {
  const setSelectedColor = usePaintStore(s => s.setColor)
  const selectedColor = usePaintStore(s => s.color)
  const setMode = usePaintStore(s => s.setMode)

  const handleClick = () => {
    setSelectedColor(color)
    setMode(MODES.PAINT)
  }

  const outline = selectedColor === color ? 'outline-4 outline-white' : ''

  return (
    <button
      className={`size-16 button rounded-sm ${outline}`}
      style={{ background: color }}
      onClick={handleClick}
    />
  )
}
