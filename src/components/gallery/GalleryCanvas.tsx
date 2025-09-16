import type { GalleryCanvas as GalleryCanvasType } from '@types'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useGridCanvasStyles } from '@/hooks/useGridCanvasStyles'
import { usePressed } from '@/hooks/usePressed'
import { CanvasImage } from '../CanvasImage'
import { CanvasViewMenu } from './CanvasViewMenu'

interface Props extends GalleryCanvasType {
  setSearchParamsId: (id: string) => void
}

export const GalleryCanvas = ({ id, dataUrl, isVisible, setSearchParamsId }: Props) => {
  const canvasRef = useRef<HTMLLIElement>(null)

  // Automatically open menu if id matches url on load
  useEffect(() => {
    const url = new URL(window.location.href)
    const idFromParams = url.searchParams.get('id')

    if (idFromParams === id) {
      openViewMenu()
    }
  }, [])

  const openViewMenu = () => {
    openMenu(<CanvasViewMenu {...{ id, dataUrl }} />)
    setSearchParamsId(id)
  }

  const { isPressed } = usePressed({
    ref: canvasRef,
    onClick: openViewMenu
  })

  const { classNameStyles } = useGridCanvasStyles({ isVisible, isPressed })
  const { openMenu } = useDialogMenu()

  return (
    <li
      ref={canvasRef}
      className={twMerge(`
        relative w-full aspect-square transition-all
        ${classNameStyles.canvasState}
      `)}
    >
      <CanvasImage
        className={`
          size-full border-3 border-theme-20 rounded-xl
        `}
        dataUrl={dataUrl}
      />
    </li>
  )
}
