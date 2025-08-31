import type { CustomEventName, ReusableComponent } from '@types'
import { useEffect } from 'react'

type EventMapFor<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : HTMLElementEventMap

interface Options extends AddEventListenerOptions {
  target?: ReusableComponent['ref'] | Window | Document | null
  deps?: unknown[]
}

export function useEvent<
  T extends Window | Document | HTMLElement,
  K extends Extract<keyof EventMapFor<T>, string>,
  E extends Event
  //
>(eventName: K | CustomEventName, handler: (event: E) => void, options: Options = {}): void {
  const eventListenerOptions: AddEventListenerOptions = (() => {
    const { target: _, deps: __, ...listenerOptions } = options
    return listenerOptions
  })()

  useEffect(() => {
    const { target } = options
    if (target === null) return

    const targetElement = target === undefined ? document : 'current' in target ? target.current : target
    const listener: EventListener = (e: Event) => handler(e as any)

    targetElement?.addEventListener(eventName, listener, eventListenerOptions)
    return () => targetElement?.removeEventListener(eventName, listener, eventListenerOptions)
  }, options?.deps ?? [])
}
