import { BLANK_DRAFT, LS_KEYS } from '@consts'
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
    const storedEditingCanvasId = getLocalStorageItem<string | null>(LS_KEYS.EDITING_CANVAS_ID, null)
    if (typeof storedEditingCanvasId === 'string') setEditingCanvasId(storedEditingCanvasId)

    // Load and validate saved canvases
    try {
      const rawStorageCanvases: StorageCanvas[] = getLocalStorageItem<StorageCanvas[]>(
        LS_KEYS.SAVED_CANVASES,
        []
      )
      const validatedStorageCanvases: SavedCanvas[] = rawStorageCanvases
        .map(c => canvasParser.fromStorage(c))
        .filter(c => !!c)

      setSavedCanvases(validatedStorageCanvases)
    } catch (err) {
      console.error('There was an error parsing saved canvases!', err)
    }

    // Load and validate draft canvas
    const rawStoredDraftCanvas = getLocalStorageItem<StorageCanvas | null>(LS_KEYS.DRAFT_CANVAS, null)
    const validatedDraftCanvas = rawStoredDraftCanvas ? canvasParser.fromStorage(rawStoredDraftCanvas) : null
    validatedDraftCanvas && setDraftPixels(validatedDraftCanvas.pixels)

    setHydrated(true)
  }, [])

  // Store editing canvas id
  useSaveItem({
    watchItem: editingCanvasId,
    key: LS_KEYS.EDITING_CANVAS_ID,
    delay: 0
  })

  // Store draft canvas
  useSaveItem({
    watchItem: draft,
    key: LS_KEYS.DRAFT_CANVAS,
    getter: ({ pixels }) => {
      return pixels.length ? canvasParser.toStorage({ ...BLANK_DRAFT, pixels }) : undefined
    }
  })

  // Store saved canvases
  useSaveItem({
    watchItem: savedCanvases,
    key: LS_KEYS.SAVED_CANVASES,
    getter: s => s.map(c => (c.pixels.length ? canvasParser.toStorage(c) : null)).filter(c => !!c)
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
