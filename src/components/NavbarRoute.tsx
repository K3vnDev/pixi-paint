import { usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
  name: string
  route: string
}

export const NavbarRoute = ({ name, route }: Props) => {
  const router = useRouter()
  const path = usePathname()

  const handleClick = () => {
    router.push(route)
  }

  const isSelected = path === route
  const style = isSelected ? 'bg-theme-bg border-theme-20 py-3.5 translate-y-[4px]' : ''

  return (
    <button
      className={twMerge(`
        py-2.5 px-12 bg-black/50 text-theme-10 font-semibold text-xl
        rounded-t-2xl border-4 border-b-0 border-transparent transition-all duration-75 ${style}
      `)}
      key={route}
      onClick={handleClick}
    >
      {name}
    </button>
  )
}
