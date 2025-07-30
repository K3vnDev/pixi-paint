'use client'

import { useRouter } from 'next/navigation'

export const Navbar = () => {
  const router = useRouter()

  const routes = [
    {
      name: 'Free Paint',
      route: '/paint'
    },
    {
      name: 'My Creations',
      route: '/mycreations'
    }
  ]

  return (
    <aside className='absolute left-1/2 -translate-1/2 top-8 flex gap-4 z-50 cursor-pointer-px'>
      {routes.map(({ name, route }) => {
        const handleClick = () => {
          router.push(route)
        }

        return (
          <button
            className='text-white py-2 px-6 bg-black/50 button cursor-pointer-px'
            key={route}
            onClick={handleClick}
          >
            {name}
          </button>
        )
      })}
    </aside>
  )
}
