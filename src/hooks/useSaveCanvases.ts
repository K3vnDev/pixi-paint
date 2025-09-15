import { BLANK_DRAFT, LS_KEYS } from '@consts'
import type { SavedCanvas, StorageCanvas } from '@types'
import { useEffect } from 'react'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { usePaintStore } from '@/store/usePaintStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'
import { useSaveItem } from './useSaveItem'

export const useSaveCanvases = () => {
  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)

  const draft = useCanvasesStore(s => s.draftCanvas)
  const setDraftPixels = useCanvasesStore(s => s.setDraftCanvasPixels)

  const hydrated = useCanvasesStore(s => s.hydrated)
  const setHydrated = useCanvasesStore(s => s.setHydrated)
  const editingPixels = usePaintStore(s => s.pixels)

  const userPublishedCanvasesIds = useRemoteStore(s => s.userPublishedCanvasesIds)
  const setUserPublishedCanvasesIds = useRemoteStore(s => s.setUserPublishedCanvasesIds)

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
      const validatedStorageCanvases: SavedCanvas[] = canvasParser.batch.fromStorage(rawStorageCanvases)
      setSavedCanvases(validatedStorageCanvases)
    } catch (err) {
      console.error('There was an error parsing saved canvases!', err)
    }

    // Load and validate draft canvas
    const rawStoredDraftCanvas = getLocalStorageItem<StorageCanvas | null>(LS_KEYS.DRAFT_CANVAS, null)
    const validatedDraftCanvas = canvasParser.fromStorage(rawStoredDraftCanvas)
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
      return canvasParser.toStorage({ ...BLANK_DRAFT, pixels }) ?? undefined
    }
  })

  // Store saved canvases
  useSaveItem({
    watchItem: savedCanvases,
    key: LS_KEYS.SAVED_CANVASES,
    getter: c => canvasParser.batch.toStorage(c)
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

  // Handle user published canvases
  useEffect(() => {
    if (!hydrated || !!userPublishedCanvasesIds || !savedCanvases.length) {
      return
    }

    dataFetch<string[]>({
      url: 'api/paintings/check',
      method: 'POST',
      json: savedCanvases,
      onSuccess: ids => setUserPublishedCanvasesIds(new Set(ids)),
      onError: () => setUserPublishedCanvasesIds(null)
    })
  }, [hydrated, userPublishedCanvasesIds, savedCanvases])

  return { savedCanvases, draft, hydrated }
}
