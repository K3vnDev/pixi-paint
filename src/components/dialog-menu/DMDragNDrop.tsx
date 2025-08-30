import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

type Props = {
  children?: string
  icon?: IconName
  allowMultipleFiles?: boolean
  acceptedFormats: string[]
  onDropOrSelect: (contents: string[]) => void
} & ReusableComponent

export const DMDragNDrop = ({
  children = 'Drag & Drop here or click to choose',
  icon = 'upload',
  className = '',
  allowMultipleFiles = false,
  acceptedFormats,
  onDropOrSelect,
  ...props
}: Props) => {
  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedFormats.join(', ')
    input.multiple = allowMultipleFiles
    input.style.display = 'none'

    document.body.appendChild(input)
    input.onchange = async e => {
      const target = e.target as HTMLInputElement
      if (!target.files?.length) {
        document.body.removeChild(input)
        return
      }

      const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsText(file)
        })
      }

      const files = Array.from(target.files)
      const contents = await Promise.all(files.map(file => readFile(file)))
      onDropOrSelect(contents)
    }

    input.click()
  }

  return (
    <div
      className={twMerge(`
        relative border-4 border-theme-10/20 border-dashed rounded-xl
        flex flex-col gap-2 items-center justify-center p-8
        hover:border-theme-10/40 active:scale-99 active:brightness-90 transition
        ${className}
      `)}
      onClick={handleClick}
      {...props}
    >
      <ColoredPixelatedImage icon={icon} className='size-16' />
      <span className='text-2xl text-pretty text-theme-10 text-center'>{children}</span>
    </div>
  )
}
