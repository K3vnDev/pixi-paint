import { DEFAULT_PRI_COLOR } from '@consts'
import { createContext } from 'react'

type ColorSelectorContext = {
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  pickerColor: string
  setPickerColor: React.Dispatch<React.SetStateAction<string>>
  lastValidColor: React.RefObject<string>
}

export const ColorSelectorContext = createContext<ColorSelectorContext>({
  menuIsOpen: false,
  setMenuIsOpen: () => {},
  pickerColor: DEFAULT_PRI_COLOR,
  setPickerColor: () => {},
  lastValidColor: { current: DEFAULT_PRI_COLOR }
})
