import { HTML_DATA_IDS } from '@consts'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import type { CreationsButtonType } from './CreationsHeader'

type Props = {
  index: number
  disabled?: boolean
} & CreationsButtonType

export const CreationsHeaderButton = ({ label, action, icon, index, disabled = false }: Props) => {
  const animationDelay = `${100 * index}ms`

  return (
    <button
      className={`
        flex lg:gap-2 gap-1 items-center border-2 border-theme-10/70 bg-theme-20/25
        lg:px-7 px-3 lg:py-2 py-1 rounded-full animate-appear button text-nowrap
        ${HTML_DATA_IDS.CREATION_CANVAS_TARGET}
      `}
      onClick={action}
      style={{ animationDelay }}
      disabled={disabled}
    >
      <ColoredPixelatedImage icon={icon} className='lg:size-8 size-6' />
      <span className='lg:text-2xl text-xl text-theme-10 font-semibold'>{label}</span>
    </button>
  )
}
