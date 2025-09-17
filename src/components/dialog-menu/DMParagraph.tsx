import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
  remark?: boolean
} & ReusableComponent

export const DMParagraph = ({ className = '', remark = false, children, ...props }: Props) => {
  const remarkStyles = remark ? 'italic text-xl font-bold' : ''

  return (
    <span
      className={twMerge(`
      text-theme-10/80 text-2xl text-pretty 
        flex flex-col gap-2 ${remarkStyles} ${className}
      `)}
      {...props}
    >
      {children}
    </span>
  )
}
