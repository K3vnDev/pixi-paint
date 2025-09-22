import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useRef } from 'react'
import { CLICK_BUTTON, ROUTES } from '@/consts'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import type { ContextMenuOption, Route as RouteType } from '@/types'
import { Route } from './Route'

export const Content = () => {
  const { media } = useResponsiveness()
  const ctxMenuRef = useRef<HTMLElement>(null)
  const pathName = usePathname()
  const router = useRouter()

  const routes = useMemo(
    () =>
      ROUTES.map(name => {
        const path = `/${name.replace(' ', '').toLowerCase()}`
        return { path, name }
      }),
    []
  )

  const [selectedRoute, ctxMenuOptions] = useMemo(() => {
    let selectedRoute: RouteType = routes[0]
    const ctxMenuOptions: ContextMenuOption[] = []

    for (const route of routes) {
      if (route.path === pathName) {
        selectedRoute = route
        continue
      }
      ctxMenuOptions.push({
        label: route.name,
        action: () => router.push(route.path)
      })
    }

    return [selectedRoute, ctxMenuOptions]
  }, [pathName])

  useContextMenu({
    ref: ctxMenuRef,
    options: ctxMenuOptions,
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT]
  })

  if (media.md) {
    return routes.map(route => (
      <Route key={route.path} {...route} isSelected={selectedRoute?.path === route.path} />
    ))
  }

  return (
    selectedRoute && (
      <>
        <Route {...selectedRoute} isSelected />
        <Route ref={ctxMenuRef} name='...' />
      </>
    )
  )
}
