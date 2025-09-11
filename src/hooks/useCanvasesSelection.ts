import { useState } from 'react'
import { HTML_DATA_IDS } from '@/consts'
import type { DraggingSelection } from '@/context/CreationsContext'
import { useCanvasStore } from '@/store/useCanvasStore'
import { useEvent } from './useEvent'

export const useCanvasesSelection = () => {
  const [isOnSelectionMode, setIsOnSelectionMode] = useState(false)
  const [selectedCanvases, setSelectedCanvases] = useState<Set<string>>(new Set())
  const [draggingSelection, setDraggingSelection] = useState<DraggingSelection>(null)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)

  const enableSelectionMode = () => setIsOnSelectionMode(true)
  const disableSelectionMode = () => setIsOnSelectionMode(false)

  const selectCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const newSet = new Set(prev)
      newSet.add(id)
      return newSet
    })
  }

  const selectAllCanvases = () => {
    const allCanvasIds = savedCanvases.map(c => c.id)
    setSelectedCanvases(new Set(allCanvasIds))
  }

  const deselectCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const deselectAllCanvases = () => setSelectedCanvases(new Set())

  const toggleCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isCanvasSelected = (id: string) => selectedCanvases.has(id)

  // Deselect all canvases when double clicking outside any canvas
  useEvent(
    'dblclick',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target || !isOnSelectionMode) return

      const clickedOnCanvasTarget = !!target.closest(`.${HTML_DATA_IDS.CREATION_CANVAS_TARGET}`)
      if (!clickedOnCanvasTarget) {
        disableSelectionMode()
        deselectAllCanvases()
      }
    },
    { deps: [isOnSelectionMode] }
  )

  return {
    selectedCanvases: Array.from(selectedCanvases),
    isOnSelectionMode,
    enableSelectionMode,
    disableSelectionMode,
    selectCanvas,
    deselectCanvas,
    toggleCanvas,
    isCanvasSelected,
    selectAllCanvases,
    deselectAllCanvases,
    draggingSelection,
    setDraggingSelection
  }
}
