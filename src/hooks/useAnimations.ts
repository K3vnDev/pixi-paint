import { useState } from 'react'
import type { AnimationData } from '@/utils/animationData'
import { useTimeout } from './useTimeout'

interface Params<T extends Record<string, AnimationData>> {
  animations: T
  preserve?: boolean
}

export const useAnimations = <T extends Record<string, AnimationData>>({
  animations,
  preserve = false
}: Params<T>) => {
  const [animation, setAnimation] = useState('')
  const [isOnAnimation, setIsOnAnimation] = useState(false)
  const { startTimeout, stopTimeout } = useTimeout()

  const startAnimation = (animData: AnimationData, onFinish?: () => void) => {
    const { value, duration } = animData
    stopTimeout()
    setAnimation(value)
    setIsOnAnimation(true)

    startTimeout(() => {
      if (!preserve) setAnimation('')
      onFinish?.()
      setIsOnAnimation(false)
      stopTimeout()
    }, duration)
  }

  const clearAnimations = () => {
    stopTimeout()
    setAnimation('')
  }

  return { animation, anims: animations, startAnimation, clearAnimations, isOnAnimation }
}
