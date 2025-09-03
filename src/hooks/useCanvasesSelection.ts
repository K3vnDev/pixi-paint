import { useState } from 'react'

export const useCanvasesSelection = () => {
  const [isOnSelectionMode, setIsOnSelectionMode] = useState(false)
  const [selectedCanvases, setSelectedCanvases] = useState<Set<string>>(new Set())

  const enableSelectionMode = () => setIsOnSelectionMode(true)
  const disableSelectionMode = () => setIsOnSelectionMode(false)

  const selectCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const newSet = new Set(prev)
      newSet.add(id)
      return newSet
    })
  }

  const deselectCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const toggleCanvas = (id: string) => {
    setSelectedCanvases(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isCanvasSelected = (id: string) => selectedCanvases.has(id)

  return {
    isOnSelectionMode,
    enableSelectionMode,
    disableSelectionMode,
    selectCanvas,
    deselectCanvas,
    toggleCanvas,
    isCanvasSelected
  }
}
