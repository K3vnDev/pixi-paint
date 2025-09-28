'use client'

import { Z_INDEX } from '@consts'
import { Routes } from './Routes'

export const Navbar = () => (
  <aside
    className={`
      fixed top-0 left-0 h-[var(--navbar-height)] w-dvw ${Z_INDEX.NAVBAR}
      bg-theme-bg border-b-4 border-b-theme-20 flex lg:gap-6 gap-4 justify-center items-end
    `}
  >
    <Routes />

    {/* Background */}
    <div
      className={`
        absolute top-0 left-0 size-full bg-gradient-to-t
        from-black/20 to-black/25 -z-50
      `}
    >
      <div
        className='size-full opacity-25'
        style={{
          backgroundImage: 'url(/gifs/squares.gif)',
          backgroundSize: 'calc(var(--navbar-height)*0.9)'
        }}
      />
    </div>
  </aside>
)
