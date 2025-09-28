import { twMerge } from 'tailwind-merge'
import type { ReusableComponent } from '@/types'
import { DMCanvasImage } from './DMCanvasImage'
import { DMParagraphsZone } from './DMParagraphsZone'
import { DMZone } from './DMZone'

type Props = {
  dataUrl?: string
  pixels?: string[]
  children?: React.ReactNode
} & ReusableComponent

export const DMParagraphsNCanvasImage = ({ children, dataUrl, pixels, className = '', ...props }: Props) => {
  return (
    <DMZone className={twMerge(`max-w-120 ${className}`)} {...props}>
      <DMParagraphsZone className='w-full'>{children}</DMParagraphsZone>
      <DMCanvasImage {...{ pixels, dataUrl }} />
    </DMZone>
  )
}
