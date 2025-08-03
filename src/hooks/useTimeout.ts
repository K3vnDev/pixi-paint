import { type DependencyList, type OnStop, useTimerHandler } from './useTimerHandler'

export const useTimeout = (dependencyList: DependencyList = [], onStop?: OnStop) => {
  const { start, stop } = useTimerHandler({
    attrs: { dependencyList, onStop },
    types: { setTimer: setTimeout, clearTimer: clearTimeout }
  })
  return { startTimeout: start, stopTimeout: stop }
}
