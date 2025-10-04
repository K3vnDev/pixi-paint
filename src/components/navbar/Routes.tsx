import { CLICK_BUTTON, ROUTES } from '@consts'
import type { ContextMenuOption } from '@types'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useRef } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import { Route } from './Route'

export const Routes = () => {
  const { media } = useResponsiveness()
  const ctxMenuRef = useRef<HTMLElement>(null)
  const pathName = usePathname()
  const router = useRouter()

  const routes = useMemo(
    () =>
      ROUTES.map(({ icon, name }) => {
        const path = `/${name.replace(' ', '').toLowerCase()}`
        return { path, name, icon }
      }),
    []
  )

  const [selectedRoute, ctxMenuOptions] = useMemo(() => {
    let selectedRoute = routes[0]
    const ctxMenuOptions: ContextMenuOption[] = []

    for (const route of routes) {
      if (route.path === pathName) {
        selectedRoute = route
        continue
      }
      ctxMenuOptions.push({
        label: route.name,
        icon: route.icon,
        action: () => router.push(route.path)
      })
    }

    return [selectedRoute, ctxMenuOptions]
  }, [pathName])

  useContextMenu({
    ref: ctxMenuRef,
    options: ctxMenuOptions,
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT],
    showWhen: !media.lg
  })

  if (media.lg) {
    return routes.map(route => (
      <Route key={route.path} {...route} isSelected={selectedRoute.path === route.path} />
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
