import confetti from 'canvas-confetti'
import { useRef } from 'react'
import type { ReusableComponent } from '@/types'
import { useTimeout } from './useTimeout'

interface Params {
  ref: ReusableComponent['ref']
  cooldown?: number
  options?: confetti.Options
  position?: {
    fromLeft?: number
    fromTop?: number
  }
}

export const useConfetti = ({ ref, cooldown, options, position = {} }: Params) => {
  const { startTimeout, stopTimeout } = useTimeout()
  const isOnCooldown = useRef(false)

  const throwConfetti = () => {
    if (!ref?.current || (cooldown && isOnCooldown.current)) return

    const { top, left, width, height } = ref.current.getBoundingClientRect()
    const { fromLeft, fromTop } = position

    const origin = {
      x: (left + width * (fromLeft ?? 0.5)) / window.innerWidth,
      y: (top + height * (fromTop ?? 0.5)) / window.innerHeight
    }
    confetti({ origin, ...options })

    if (cooldown) {
      isOnCooldown.current = true
      startTimeout(() => {
        isOnCooldown.current = false
        stopTimeout()
      }, cooldown)
    }
  }

  return { throwConfetti }
}
