import { createContext } from 'react'

type CreationsContext = {
  isOnSelectionMode: boolean
  setIsOnSelectionMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreationsContext = createContext<CreationsContext>({
  isOnSelectionMode: false,
  setIsOnSelectionMode: () => {}
})
