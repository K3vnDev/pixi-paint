import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import type { IconName } from '@types'
import { useContext, useEffect, useRef, useState } from 'react'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useActionOnKey } from '@/hooks/useActionOnKey'
import { useFreshRef } from '@/hooks/useFreshRef'
import { useTimeout } from '@/hooks/useTimeout'
import { validateColor } from '@/utils/validateColor'

interface Props {
  menuIsOpen: boolean
  closeMenu: () => void
}

export const TextInput = ({ menuIsOpen, closeMenu }: Props) => {
  const { pickerColor, setPickerColor, lastValidColor } = useContext(ColorSelectorContext)
  const [buttonIcon, setButtonIcon] = useState<IconName>('clone')
  const BUTTON_CHECK_TIME = 1000
  const { startTimeout, stopTimeout } = useTimeout()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFocused = useRef(false)
  const menuIsOpenRef = useFreshRef(menuIsOpen)

  // biome-ignore format: <>
  useActionOnKey( ['Enter', 'Escape'], () => {
    if (menuIsOpenRef.current) {
      closeMenu()
    }
  }, [], { allowOnInput: true, allowCtrlKey: true, allowShiftKey: true })

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isFocused.current && menuIsOpenRef.current) {
        const pastedText = e.clipboardData?.getData('text')
        if (!pastedText) return
        selectInput()
      }
    }
    document.addEventListener('paste', handlePaste, { capture: true })
    return () => document.removeEventListener('paste', handlePaste, { capture: true })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!inputRef.current) return
      const { key, ctrlKey, shiftKey } = e
      const { length } = inputRef.current.value

      if (menuIsOpenRef.current && !isFocused.current) {
        if (ctrlKey || shiftKey) {
          inputRef.current.focus()
          selectInput()
        } else if (key.length === 1 || key === 'Backspace') {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(length, length)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPickerColor(value)
  }

  const handleTextFocus = () => {
    isFocused.current = true
    selectInput()
  }

  const handleTextBlur = () => {
    const { value, isValid } = validateColor(pickerColor)
    isFocused.current = false

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

  const selectInput = () => inputRef.current?.select()

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
        ref={inputRef}
        value={pickerColor}
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        onChange={handleTextChange}
        maxLength={15}
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
