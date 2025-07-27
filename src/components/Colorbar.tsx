import { MODES } from '@consts'
import { usePaintStore } from '@/store/usePaintStore'

export const Colorbar = () => {
  const colors = [
    '#E14434', // red
    '#FF7A30', // orange
    '#735951', // brown
    '#fae337', // yellow
    '#7ad63a', // light green
    '#187a23', // dark green
    '#60cdfc', // light blue
    '#3d63fc', // dark blue
    '#8b26eb', // purple
    '#fc72da', // pink
    '#fff', // white
    '#000' // black
  ]

  return (
    <aside className='flex flex-col gap-2 absolute right-8'>
      <ul className='grid grid-cols-2 gap-2'>
        {colors.map(col => (
          <Color color={col} key={col} />
        ))}
      </ul>
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
    <li
      className={`size-16 button rounded-sm ${outline}`}
      style={{ background: color }}
      onClick={handleClick}
    />
  )
}
