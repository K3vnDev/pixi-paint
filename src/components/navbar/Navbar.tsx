'use client'

import { ROUTES, Z_INDEX } from '@consts'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import { Route } from './Route'

export const Navbar = () => {
  const routes = useMemo(
    () =>
      ROUTES.map(name => {
        const path = `/${name.replace(' ', '').toLowerCase()}`
        return { path, name }
      }),
    []
  )

  const { media } = useResponsiveness()
  const pathName = usePathname()
  const selectedRoute = useMemo(() => routes.find(({ path }) => path === pathName), [])

  return (
    <aside
      className={`
        fixed top-0 left-0 h-[var(--navbar-height)] w-full ${Z_INDEX.NAVBAR}
        bg-theme-bg border-b-4 border-b-theme-20 flex gap-6 justify-center items-end
      `}
    >
      {media.md
        ? routes.map(route => (
            <Route key={route.path} {...route} isSelected={selectedRoute?.path === route.path} />
          ))
        : selectedRoute && <Route {...selectedRoute} isSelected />}

      {/* Background */}
      <div className='absolute top-0 left-0 size-full bg-gradient-to-t from-black/20 to-black/45 -z-50' />
    </aside>
  )
}
