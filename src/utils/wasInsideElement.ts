type Target = Element | EventTarget | null

const selectorUtl = (target: Target, selector: string) => {
  return target !== null && !!(target as Element).closest(selector)
}

export const wasInsideElement = (target: Target) => ({
  selector: (selector: string) => selectorUtl(target, selector),
  id: (id: string) => selectorUtl(target, `#${id}`)
})
