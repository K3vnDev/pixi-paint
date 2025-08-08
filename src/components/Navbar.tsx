'use client'

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
        fixed top-0 left-0 h-[var(--navbar-height)] w-full z-50
        bg-[#110C1F] border-b-4 border-b-theme-20 flex gap-6 justify-center items-end
      `}
    >
      {routes.map(route => (
        <NavbarRoute key={route.route} {...route} />
      ))}
    </aside>
  )
}
