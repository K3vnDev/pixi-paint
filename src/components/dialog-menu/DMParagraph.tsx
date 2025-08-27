import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children: string
} & ReusableComponent

export const DMParagraph = ({ className = '', children, ...props }: Props) => {
  const paragraphs = children.split('\n').map(p => p.trim())

  return (
    <span
      className={twMerge(`
      text-theme-10/80 text-2xl text-pretty 
        flex flex-col gap-2  ${className}
      `)}
      {...props}
    >
      {paragraphs.map((p, i) => (
        <span key={i}>{p}</span>
      ))}
    </span>
  )
}
