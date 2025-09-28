import { type DependencyList, type OnStop, useTimerHandler } from './useTimerHandler'

export const useInterval = (dependencyList: DependencyList = [], onStop?: OnStop) => {
  const { start, stop } = useTimerHandler({
    attrs: { dependencyList, onStop },
    types: { setTimer: setInterval, clearTimer: clearInterval }
  })
  return { startInterval: start, stopInterval: stop }
}
