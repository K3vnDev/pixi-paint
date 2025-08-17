'use client'

import { Z_INDEX } from '@/consts'
import { NavbarRoute } from './NavbarRoute'

export const Navbar = () => {
  const routes = [
    {
      name: 'Paint',
      route: '/paint'
    },
    {
      name: 'My Creations',
      route: '/mycreations'
    }
  ]

  return (
    <aside
      className={`
        fixed top-0 left-0 h-[var(--navbar-height)] w-full ${Z_INDEX.NAVBAR}
        bg-black/30 border-b-4 border-b-theme-20 flex gap-6 justify-center items-end
      `}
    >
      {routes.map(route => (
        <NavbarRoute key={route.route} {...route} />
      ))}
    </aside>
  )
}
