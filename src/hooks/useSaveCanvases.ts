import { BLANK_DRAFT, LS_DRAFT_CANVAS_KEY, LS_EDITING_CANVAS_ID_KEY, LS_SAVED_CANVASES_KEY } from '@consts'
import type { SavedCanvas, StorageCanvas } from '@types'
import { useEffect } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { canvasParser } from '@/utils/canvasParser'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'
import { useSaveItem } from './useSaveItem'

export const useSaveCanvases = () => {
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const generateCanvasId = useCanvasStore(s => s.getNewCanvasId)

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)

  const draft = useCanvasStore(s => s.draftCanvas)
  const setDraftPixels = useCanvasStore(s => s.setDraftCanvasPixels)

  const hydrated = useCanvasStore(s => s.hydrated)
  const setHydrated = useCanvasStore(s => s.setHydrated)
  const editingPixels = usePaintStore(s => s.pixels)

  // Hydrate by loading data from local storage
  useEffect(() => {
    if (hydrated) return

    // Editing canvas id
    const storedEditingCanvasId = getLocalStorageItem<string | null>(LS_EDITING_CANVAS_ID_KEY, null)
    setEditingCanvasId(storedEditingCanvasId)

    // Saved canvases
    const storedSavedCanvases: SavedCanvas[] = getLocalStorageItem<StorageCanvas[]>(LS_SAVED_CANVASES_KEY, [])
      .map(c => {
        const parsed = canvasParser.fromStorage(c)
        if (parsed === null) return null

        const id = parsed.id ?? generateCanvasId()
        return { ...parsed, id }
      })
      .filter(c => !!c)

    setSavedCanvases(storedSavedCanvases)

    // Draft canvas
    const rawStoredDraftCanvas = getLocalStorageItem<StorageCanvas>(
      LS_DRAFT_CANVAS_KEY,
      canvasParser.toStorage(BLANK_DRAFT)
    )
    const storedDraftCanvasPixels = canvasParser.fromStorage(rawStoredDraftCanvas)
    storedDraftCanvasPixels && setDraftPixels(storedDraftCanvasPixels.pixels)

    setHydrated(true)
  }, [])

  // Store editing canvas id
  useSaveItem({
    watchItem: editingCanvasId,
    key: LS_EDITING_CANVAS_ID_KEY
  })

  // Store draft canvas
  useSaveItem({
    watchItem: draft,
    key: LS_DRAFT_CANVAS_KEY,
    getter: d => canvasParser.toStorage(d)
  })

  // Store saved canvases
  useSaveItem({
    watchItem: savedCanvases,
    key: LS_SAVED_CANVASES_KEY,
    getter: s => s.map(c => canvasParser.toStorage(c))
  })

  // Handle draft or saved canvas update
  useEffect(() => {
    const isDraft = editingCanvasId === null

    // Update draft
    if (isDraft && hydrated) {
      setDraftPixels(editingPixels)
      return
    }

    // Update saved
    const index = savedCanvases.findIndex(c => c.id === editingCanvasId)
    if (index === -1) return

    const newCanvases = structuredClone(savedCanvases)
    newCanvases[index] = {
      ...newCanvases[index],
      pixels: editingPixels
    }
    setSavedCanvases(newCanvases)
  }, [editingPixels])

  return { savedCanvases, draft, hydrated }
}
