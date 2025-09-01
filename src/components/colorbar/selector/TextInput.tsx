import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import type { IconName } from '@types'
import { useContext, useEffect, useRef, useState } from 'react'
import { ColorSelectorContext } from '@/context/ColorSelectorContext'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useTimeout } from '@/hooks/useTimeout'
import { validateColor } from '@/utils/validateColor'

export const TextInput = () => {
  const { pickerColor, setPickerColor, lastValidColor, menuIsOpen } = useContext(ColorSelectorContext)
  const [buttonIcon, setButtonIcon] = useState<IconName>('clone')
  const { startTimeout, stopTimeout } = useTimeout()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFocused = useRef(false)
  const menuIsOpenRef = useFreshRefs(menuIsOpen)

  const BUTTON_CHECK_TIME = 1000
  const MAX_LENGTH = 16

  useEvent(
    'paste',
    (e: ClipboardEvent) => {
      if (!isFocused.current && menuIsOpenRef.current) {
        const pastedText = e.clipboardData?.getData('text')
        if (pastedText) inputUtils.select()
      }
    },
    { capture: true }
  )

  useEvent(
    'keydown',
    (e: KeyboardEvent) => {
      if (!inputRef.current) return
      const { key, ctrlKey, shiftKey } = e

      if (menuIsOpenRef.current && !isFocused.current) {
        if (ctrlKey || shiftKey) {
          inputRef.current.focus()
          inputUtils.select()
        } else if (key.length === 1 || key === 'Backspace') {
          inputUtils.focus()
          inputUtils.cursorRight()
        }
      }
    },
    { capture: true }
  )

  useEffect(() => {
    !menuIsOpen && inputUtils.blur()
  }, [menuIsOpen])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPickerColor(value)
  }

  const handleTextFocus = () => {
    isFocused.current = true
    inputUtils.select()
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

  const inputUtils = {
    select: () => inputRef.current?.select(),
    focus: () => inputRef.current?.focus(),
    cursorRight: () => inputRef.current?.setSelectionRange(MAX_LENGTH, MAX_LENGTH),
    blur: () => inputRef.current?.blur()
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
        ref={inputRef}
        value={pickerColor}
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        onChange={handleTextChange}
        maxLength={MAX_LENGTH}
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
