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
        bg-theme-bg border-b-4 border-b-theme-20 flex gap-6 justify-center items-end
      `}
    >
      {routes.map(route => (
        <NavbarRoute key={route.route} {...route} />
      ))}

      {/* Background */}
      <div className='absolute top-0 left-0 size-full bg-gradient-to-t from-black/20 to-black/45 -z-50' />
    </aside>
  )
}
