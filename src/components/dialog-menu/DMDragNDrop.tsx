import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import type { IconName, ReusableComponent } from '@types'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTimeout } from '@/hooks/timer-handlers/useTimeout'
import { useEvent } from '@/hooks/useEvent'

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
  const [isDragginOver, setIsDraggingOver] = useState(false)
  const { startTimeout, stopTimeout } = useTimeout()
  const DRAG_OVER_MIN = 220

  useEvent('drop', (e: DragEvent) => {
    e.preventDefault()

    if (e.dataTransfer) {
      const { files } = e.dataTransfer
      handleFiles(files)
    }
  })

  useEvent('dragover', (e: DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)

    stopTimeout()
    startTimeout(() => {
      setIsDraggingOver(false)
    }, DRAG_OVER_MIN)
  })

  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedFormats.join(', ')
    input.multiple = allowMultipleFiles
    input.style.display = 'none'
    document.body.appendChild(input)

    input.onchange = async e => {
      const { files } = e.target as HTMLInputElement
      files && (await handleFiles(files))
      document.body.removeChild(input)
    }

    input.click()
  }

  const handleFiles = async (fileList: FileList) => {
    const readFile = (file: File): Promise<string | null> => {
      return new Promise(res => {
        try {
          const reader = new FileReader()
          reader.onload = () => res(reader.result as string)
          reader.onerror = () => res(null)
          reader.readAsText(file)
        } catch {
          res(null)
        }
      })
    }

    const files = Array.from(fileList)
    if (!files.length) return

    const allContents = await Promise.all(files.map(file => readFile(file)))
    const validContents = allContents.filter((c): c is string => {
      if (typeof c !== 'string') {
        console.error('Failed to import a file!')
        return false
      }
      return true
    })
    onDropOrSelect(validContents)
  }

  const [twBaseStyles, twIconStyles, text] = isDragginOver
    ? ['border-theme-10 animate-pulse', 'animate-bounce', 'Drop your files here!']
    : ['', '', children]

  return (
    <div
      className={twMerge(`
        relative border-4 border-theme-10/20 border-dashed rounded-xl
        flex flex-col gap-2 items-center justify-center p-8
        hover:border-theme-10/40 active:scale-99 active:brightness-90 transition
        ${twBaseStyles} ${className}
      `)}
      onClick={handleClick}
      {...props}
    >
      <ColoredPixelatedImage icon={icon} className={`size-16 ${twIconStyles}`} />
      <span
        className={`
          flex items-center justify-center text-center text-2xl
          text-pretty text-theme-10
        `}
      >
        {text}
      </span>
    </div>
  )
}
