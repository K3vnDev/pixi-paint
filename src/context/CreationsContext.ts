import type React from 'react'
import { createContext } from 'react'

export type DraggingSelection = 'selecting' | 'deselecting' | null

type CreationsContext = {
  isOnSelectionMode: boolean
  enableSelectionMode: () => void
  disableSelectionMode: () => void

  draggingSelection: DraggingSelection
  setDraggingSelection: React.Dispatch<React.SetStateAction<DraggingSelection>>

  selectedCanvases: string[]
  selectCanvas: (id: string) => void
  deselectCanvas: (id: string) => void
  toggleCanvas: (id: string) => void
  selectAllCanvases: () => void
  deselectAllCanvases: () => void

  isCanvasSelected: (id: string) => boolean

  hasTallHeader: boolean
  setHasTallHeader: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreationsContext = createContext<CreationsContext>({
  isOnSelectionMode: false,
  enableSelectionMode: () => {},
  disableSelectionMode: () => {},

  draggingSelection: null,
  setDraggingSelection: () => {},

  selectedCanvases: [],
  selectCanvas: () => {},
  deselectCanvas: () => {},
  toggleCanvas: () => {},
  selectAllCanvases: () => {},
  deselectAllCanvases: () => {},
  isCanvasSelected: () => false,

  hasTallHeader: false,
  setHasTallHeader: () => {}
})
