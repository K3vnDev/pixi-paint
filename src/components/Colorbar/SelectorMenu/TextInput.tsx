import type { IconName } from '@types'
import { useContext, useRef, useState } from 'react'
import { ColoredPixelatedImage } from '@/components/ColoredPixelatedImage'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useTimeout } from '@/hooks/useTimeout'
import { validateColor } from '@/utils/validateColor'

export const TextInput = () => {
  const { pickerColor, setPickerColor, lastValidColor } = useContext(ColorSelectorContext)
  const [buttonIcon, setButtonIcon] = useState<IconName>('clone')
  const BUTTON_CHECK_TIME = 1000
  const { startTimeout, stopTimeout } = useTimeout()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleColorTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPickerColor(value)
  }

  const handleColorTextBlur = () => {
    const { value, isValid } = validateColor(pickerColor)
    if (isValid) {
      setPickerColor(value)
    } else {
      setPickerColor(lastValidColor.current)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pickerColor)
    setButtonIcon('check')

    stopTimeout()
    startTimeout(() => {
      setButtonIcon('clone')
    }, BUTTON_CHECK_TIME)
  }

  return (
    <label
      className={`
        bg-black/50 rounded-md border-2 border-theme-20/50 outline-none 
        focus-within:border-theme-20 focus-within:shadow-md focus-within:shadow-theme-20/30
        flex justify-between w-full
      `}
    >
      <input
        className='outline-none text-xl text-theme-10 w-full px-3 py-1'
        value={pickerColor}
        onBlur={handleColorTextBlur}
        onChange={handleColorTextChange}
        maxLength={9}
      />
      <button
        className='w-fit h-full flex items-center px-2 py-1 button'
        onClick={copyToClipboard}
        ref={buttonRef}
      >
        <ColoredPixelatedImage icon={buttonIcon} className='bg-theme-10 size-8 scale-110' />
      </button>
    </label>
  )
}
