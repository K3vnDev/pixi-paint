import type { ReusableComponent } from '@types'

type Props = {
  children: React.ReactNode
} & ReusableComponent

export const DMLabel = ({ children, className = '', ...props }: Props) => (
  <span
    className={`
      font-bold text-xl text-theme-10 w-fit text-nowrap 
      ${className}
    `}
    {...props}
  >
    {children}
  </span>
)
