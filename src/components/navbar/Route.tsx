import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
  name: string
  path: string
  isSelected: boolean
}

export const Route = ({ name, path, isSelected }: Props) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(path)
  }

  const style = isSelected
    ? 'bg-theme-bg border-theme-20 lg:py-3.5 py-3 translate-y-[4px]'
    : 'active:text-theme-10/75 active:scale-90'

  return (
    <button
      className={twMerge(`
        lg:py-2.5 py-2 lg:px-12 md:px-8 px-12  bg-black/50 text-theme-10 font-semibold text-xl origin-bottom
        rounded-t-2xl border-4 border-b-0 border-transparent transition-all duration-75
        ${style}
      `)}
      onClick={handleClick}
    >
      {name}
    </button>
  )
}
