import { BLANK_DRAFT } from '@consts'
import { useEffect, useRef } from 'react'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { UPI_COOLDOWN, useRemoteStore } from '@/store/useRemoteStore'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'

export const useUserPublishedIds = (fetchOnenter = false) => {
  const nextUPIRefresh = useRemoteStore(s => s.nextUPIRefresh)
  const refreshUserPublishedIds = useRemoteStore(s => s.refreshUPI)
  const setUPIRefreshCooldown = useRemoteStore(s => s.setUPIRefreshCooldown)

  const hydrated = useCanvasesStore(s => s.hydrated)
  const savedCanvasesRef = useFreshRefs(useCanvasesStore(s => s.savedCanvases))

  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const upiCooldownSet = useRef(false)

  useEvent('$painted', () => {
    if (editingCanvasId && editingCanvasId !== BLANK_DRAFT.id && !upiCooldownSet.current) {
      setUPIRefreshCooldown(UPI_COOLDOWN.INSTANT)
      upiCooldownSet.current = true
    }
  })

  useEffect(() => {
    const afterCooldown = Date.now() >= nextUPIRefresh
    if (fetchOnenter && hydrated && afterCooldown) {
      requestAnimationFrame(() => refreshUserPublishedIds(savedCanvasesRef.current))
    }
  }, [nextUPIRefresh, hydrated])

  // biome-ignore format: <>
  useEffect(() => () => { upiCooldownSet.current = false }, [])
}
