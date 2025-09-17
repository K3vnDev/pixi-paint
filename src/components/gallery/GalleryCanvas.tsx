import { OverwriteDraftDMenu } from '@@/OverwriteDraftDMenu'
import type { GalleryCanvas as GalleryCanvasType } from '@types'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useGridCanvasStyles } from '@/hooks/useGridCanvasStyles'
import { useOverwriteDraft } from '@/hooks/useOverwriteDraft'
import { usePressed } from '@/hooks/usePressed'
import { CanvasImage } from '../CanvasImage'
import { CanvasViewMenu } from './CanvasViewMenu'

interface Props extends GalleryCanvasType {
  setSearchParamsId: (id: string) => void
  initiallyOpenMenu: boolean
  pixels: string[]
}

export const GalleryCanvas = ({
  id,
  dataUrl,
  initiallyOpenMenu,
  setSearchParamsId,
  pixels,
  isVisible
}: Props) => {
  const canvasRef = useRef<HTMLLIElement>(null)
  const { canOverwriteDraft, overwriteDraft, saveDraft, draftPixels } = useOverwriteDraft(pixels)
  const router = useRouter()

  // Automatically open menu if id matches url on load
  useEffect(() => {
    initiallyOpenMenu && openViewMenu()
  }, [initiallyOpenMenu])

  const openViewMenu = () => {
    openMenu(<CanvasViewMenu {...{ id, dataUrl, closeMenu, pixels, openInDraft }} />)
    setSearchParamsId(id)
  }

  const { isPressed } = usePressed({
    ref: canvasRef,
    onClick: openViewMenu
  })

  const { classNameStyles } = useGridCanvasStyles({ isVisible, isPressed })
  const { openMenu, closeMenu } = useDialogMenu()

  const overwriteDraftTravel = () => {
    overwriteDraft(true)

    requestAnimationFrame(() => {
      router.push('/paint')
    })
  }

  const openInDraft = () => {
    if (canOverwriteDraft()) {
      overwriteDraftTravel()
      closeMenu()
    } else {
      openMenu(
        <OverwriteDraftDMenu
          pixels={draftPixels}
          goodOption={{
            label: 'Save it, then clone',
            action: () => {
              saveDraft()
              overwriteDraftTravel()
            }
          }}
          badOption={{
            label: 'Yeah, override',
            action: overwriteDraftTravel
          }}
        />
      )
    }
  }

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
