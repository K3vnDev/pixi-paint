import { BLANK_DRAFT, LS_KEYS } from '@consts'
import type { SavedCanvas, StorageCanvas, StoredSelectedColors } from '@types'
import { useEffect, useMemo } from 'react'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { usePaintStore } from '@/store/usePaintStore'
import { canvasParser } from '@/utils/canvasParser'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'
import { validateColor } from '@/utils/validateColor'
import { useFreshRefs } from './useFreshRefs'
import { useSaveItem } from './useSaveItem'

export const useSaveCanvases = () => {
  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)

  const draft = useCanvasesStore(s => s.draftCanvas)
  const setDraftPixels = useCanvasesStore(s => s.setDraftCanvasPixels)

  const primaryColor = usePaintStore(s => s.primaryColor)
  const secondaryColor = usePaintStore(s => s.secondaryColor)
  const selectedColors = useMemo(() => ({ primaryColor, secondaryColor }), [primaryColor, secondaryColor])

  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const hydrated = useCanvasesStore(s => s.hydrated)
  const setHydrated = useCanvasesStore(s => s.setHydrated)
  const editingPixels = usePaintStore(s => s.pixels)

  const refs = useFreshRefs({ hydrated, editingCanvasId })

  // Hydrate by loading data from local storage
  useEffect(() => {
    if (hydrated) return

    // Editing canvas id
    const storedEditingCanvasId = getLocalStorageItem<string | null>(LS_KEYS.EDITING_CANVAS_ID, null)
    if (typeof storedEditingCanvasId === 'string') setEditingCanvasId(storedEditingCanvasId)

    // Load and validate saved canvases
    const rawStorageCanvases: StorageCanvas[] = getLocalStorageItem<StorageCanvas[]>(
      LS_KEYS.SAVED_CANVASES,
      []
    )
    const validatedStorageCanvases: SavedCanvas[] = canvasParser.batch.fromStorage(rawStorageCanvases)
    setSavedCanvases(validatedStorageCanvases)

    // Load and validate draft canvas
    const rawStoredDraftCanvas = getLocalStorageItem<StorageCanvas | null>(LS_KEYS.DRAFT_CANVAS, null)
    const validatedDraftCanvas = canvasParser.fromStorage(rawStoredDraftCanvas)
    validatedDraftCanvas && setDraftPixels(validatedDraftCanvas.pixels)

    // Load selected colors
    const storedSelectedColors = getLocalStorageItem<StoredSelectedColors | null>(
      LS_KEYS.SELECTED_COLORS,
      null
    )
    if (storedSelectedColors) {
      const validateAndSetColor = (color: string, setter: (c: string) => void) => {
        const { value, isValid } = validateColor(color)
        if (isValid && value) setter(value)
      }
      const { primaryColor, secondaryColor } = storedSelectedColors
      validateAndSetColor(primaryColor, setPrimaryColor)
      validateAndSetColor(secondaryColor, setSecondaryColor)
    }

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
      if (!pixels.length) return undefined
      const parsed = canvasParser.toStorage({ ...BLANK_DRAFT, pixels })
      return parsed ?? undefined
    }
  })

  // Store saved canvases
  useSaveItem({
    watchItem: savedCanvases,
    key: LS_KEYS.SAVED_CANVASES,
    getter: c => canvasParser.batch.toStorage(c)
  })

  // Store selected colors
  useSaveItem({
    watchItem: selectedColors,
    key: LS_KEYS.SELECTED_COLORS
  })

  // Handle draft or saved canvas update
  useEffect(() => {
    const { editingCanvasId, hydrated } = refs.current
    if (!hydrated) return

    // Update draft
    if (editingCanvasId === null && hydrated) {
      setDraftPixels(editingPixels)
      return
    }

    // Update saved
    const index = savedCanvases.findIndex(c => c.id === editingCanvasId)
    if (index === -1) return

    setSavedCanvases(newCanvases => {
      newCanvases[index] = {
        ...newCanvases[index],
        pixels: editingPixels
      }
      return newCanvases
    })
  }, [editingPixels])

  return { savedCanvases, draft, hydrated }
}
