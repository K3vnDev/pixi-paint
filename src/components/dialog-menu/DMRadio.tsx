import type { Option, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { DMLabel } from './DMLabel'

type Props = {
  label: string
  selectedIndex?: number
  options: Option[]
  onSelect?: (newIndex: number) => void
} & ReusableComponent

export const DMRadio = ({ label, selectedIndex = 0, options, onSelect, className = '', ...props }: Props) => {
  return (
    <div className={twMerge(`flex gap-6 items-center w-fit ${className}`)} {...props}>
      <DMLabel>{label}</DMLabel>
      <ul
        className={twMerge(`
          flex not-md:flex-col items-center justify-center transition
          md:py-2 md:w-fit w-full md:gap-4 gap-2
        `)}
      >
        {options.map((option, i) => (
          <DMOption {...{ selectedIndex, onSelect, ...option }} index={i} key={i} />
        ))}
      </ul>
    </div>
  )
}

type DMOptionProps = {
  index: number
  selectedIndex: number
  onSelect?: (index: number) => void
} & Option

const DMOption = ({ icon, index, label, selectedIndex, onSelect }: DMOptionProps) => {
  const handleClick = () => {
    if (selectedIndex !== index) {
      onSelect?.(index)
    }
  }

  const [baseStyle, roundStyle] =
    selectedIndex === index
      ? ['bg-theme-20/30 border-theme-10/40', 'border-theme-10 bg-theme-10 scale-115']
      : ['border-theme-10/15 button', 'border-theme-10/35']

  return (
    <li
      key={index}
      className={`
        flex justify-center gap-1.5 items-center border-2 transition
        md:pr-8 md:pl-6 md:py-2 not-md:w-full py-1 rounded-full ${baseStyle}
      `}
      onClick={handleClick}
    >
      <div className={`size-4 rounded-full border-2 mr-2 transition ${roundStyle}`} />
      <ColoredPixelatedImage icon={icon} />
      <span className='text-xl text-theme-10 text-nowrap'>{label}</span>
    </li>
  )
}
