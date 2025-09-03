import { createContext } from 'react'

type CreationsContext = {
  isOnSelectionMode: boolean
  enableSelectionMode: () => void
  disableSelectionMode: () => void

  selectCanvas: (id: string) => void
  deselectCanvas: (id: string) => void
  toggleCanvas: (id: string) => void
  isCanvasSelected: (id: string) => boolean
}

export const CreationsContext = createContext<CreationsContext>({
  isOnSelectionMode: false,
  enableSelectionMode: () => {},
  disableSelectionMode: () => {},

  selectCanvas: () => {},
  deselectCanvas: () => {},
  toggleCanvas: () => {},
  isCanvasSelected: () => false
})
