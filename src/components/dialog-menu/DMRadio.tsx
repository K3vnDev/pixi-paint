import type { Option, ReusableComponent } from '@types'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { DMLabel } from './DMLabel'

type Props = {
  label: string
  startIndex?: number
  options: Option[]
  onSelect?: (newIndex: number) => void
} & ReusableComponent

export const DMRadio = ({ label, startIndex = 0, options, onSelect, className = '', ...props }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(startIndex)
  useEffect(() => onSelect?.(selectedIndex), [selectedIndex])

  console.log({ selectedIndex })

  return (
    <div className={twMerge(`flex gap-6 items-center w-fit ${className}`)} {...props}>
      <DMLabel>{label}</DMLabel>
      <ul
        className={twMerge(`
          flex items-center justify-center py-2 w-fit
          transition gap-4
        `)}
      >
        {options.map((option, i) => (
          <DMOption {...{ selectedIndex, setSelectedIndex, ...option }} index={i} key={i} />
        ))}
      </ul>
    </div>
  )
}

type DMOptionProps = {
  index: number
  selectedIndex: number
  setSelectedIndex: (index: number) => void
} & Option

const DMOption = ({ icon, index, label, selectedIndex, setSelectedIndex }: DMOptionProps) => {
  const handleClick = () => {
    if (selectedIndex !== index) {
      setSelectedIndex(index)
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
        flex gap-1.5 items-center border-2 transition
        pr-8 pl-6 py-2 rounded-full ${baseStyle}
      `}
      onClick={handleClick}
    >
      <div className={`size-4 rounded-full border-2 mr-2 transition ${roundStyle}`} />
      <ColoredPixelatedImage icon={icon} />
      <span className='text-xl text-theme-10 text-nowrap'>{label}</span>
    </li>
  )
}
