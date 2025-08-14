import { DEFAULT_COLOR } from '@consts'
import { createContext } from 'react'

type ColorSelectorContext = {
  pickerColor: string
  setPickerColor: React.Dispatch<React.SetStateAction<string>>
  lastValidColor: React.RefObject<string>
}

export const ColorSelectorContext = createContext<ColorSelectorContext>({
  pickerColor: DEFAULT_COLOR,
  setPickerColor: () => {},
  lastValidColor: { current: DEFAULT_COLOR }
})
