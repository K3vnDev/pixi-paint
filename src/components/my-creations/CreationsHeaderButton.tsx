import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import type { CreationsButtonType } from './CreationsHeader'

type Props = {
  index: number
} & CreationsButtonType

export const CreationsHeaderButton = ({ label, action, icon, index }: Props) => {
  const animationDelay = `${100 * index}ms`

  return (
    <button
      className={`
        flex gap-2 items-center border-2 border-theme-10/70 bg-theme-20/25
        px-7 py-2 rounded-full animate-appear button text-nowrap
      `}
      onClick={action}
      style={{ animationDelay }}
    >
      <ColoredPixelatedImage icon={icon} className='size-8' />
      <span className='text-2xl text-theme-10 font-semibold'>{label}</span>
    </button>
  )
}
