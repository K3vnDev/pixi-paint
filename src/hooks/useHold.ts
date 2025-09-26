import { useCallback, useRef } from 'react'
import { useEvent } from './useEvent'
import { useTimeout } from './useTimeout'

type UseHoldOptions = {
  ref: React.RefObject<HTMLElement | null>
  onHold?: (e: TouchEvent) => void
  onCancel?: (e: CancelTouchEvent) => void
  holdTime?: number
}

type CancelTouchEvent = {
  cancelledFromMove: boolean
} & TouchEvent

export function useHold({ ref: target, onHold, onCancel, holdTime = 400 }: UseHoldOptions) {
  const { startTimeout, stopTimeout } = useTimeout()
  const isHoldingRef = useRef(false)

  const startHold = useCallback(
    (e: TouchEvent) => {
      isHoldingRef.current = true

      startTimeout(() => {
        onHold?.(e)
        stopTimeout()
        isHoldingRef.current = false
      }, holdTime)
    },
    [onHold]
  )

  const cancelHold = useCallback((e: TouchEvent) => {
    if (isHoldingRef.current) {
      const cancelledFromMove = e.type === 'touchmove'
      onCancel?.({ ...e, cancelledFromMove })
      isHoldingRef.current = false
      stopTimeout()
    }
  }, [])

  useEvent('touchstart', startHold, { target })
  useEvent('touchmove', cancelHold, { target })
  useEvent('touchend', cancelHold, { target })
}
