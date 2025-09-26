import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const CanvasesGrid = ({ children, className = '', ref, ...props }: Props) => (
  <ul
    className={twMerge(`
      grid 2xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 w-full gap-5
      px-[var(--galery-pad-x)] place-content-center pt-4 pb-20 ${className}
    `)}
    {...props}
  >
    {children}
  </ul>
)
