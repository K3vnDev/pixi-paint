import { DMButton } from '@@/dialog-menu/DMButton'
import { DMCanvasImage } from '@@/dialog-menu/DMCanvasImage'
import { DMHeader } from '@@/dialog-menu/DMHeader'
import { DMParagraph } from '@@/dialog-menu/DMParagraph'
import { DMParagraphsZone } from '@@/dialog-menu/DMParagraphsZone'
import { DMZone } from '@@/dialog-menu/DMZone'
import { useEffect, useState } from 'react'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useTimeout } from '@/hooks/useTimeout'
import { useRemoteStore } from '@/store/useRemoteStore'
import type { IconName } from '@/types'
import { dataFetch } from '@/utils/dataFetch'
import { pixelsComparison } from '@/utils/pixelsComparison'

interface Props {
  localCanvasId: string
  dataUrl: string
  pixels: string[]
}

export const SharePaintingMenu = ({ localCanvasId, dataUrl, pixels }: Props) => {
  const [remoteCanvasId, setRemoteCanvasId] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const publishedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setUserPublishedIds = useRemoteStore(s => s.setUserPublishedIds)

  const { startTimeout } = useTimeout()
  const { openMenu, closeMenu } = useDialogMenu()
  const refs = useFreshRefs({ dataUrl, pixels, publishedCanvases })

  const handlePaintingId = (id: string) => {
    setRemoteCanvasId(id)
  }

  useEffect(() => {
    // Reset state
    const { pixels, publishedCanvases } = refs.current

    // Try to find id in local loaded published cavases
    const foundCanvas = publishedCanvases.find(c => pixelsComparison(c.pixels, pixels))
    if (foundCanvas) {
      handlePaintingId(foundCanvas.id)
      return
    }
    // If not possible, fetch id from the server
    dataFetch<string>({
      url: '/api/paintings/share',
      method: 'POST',
      json: pixels,
      onSuccess: foundId => handlePaintingId(foundId),
      onError: (_, code) => {
        const [errorMsg1, errorMsg2] =
          code === 404
            ? (() => {
                setUserPublishedIds(ids => {
                  ids?.delete(localCanvasId)
                  return ids
                })
                return [
                  "Whoops, seems like the painting you're trying to share hasn't been published yet.",
                  "You're gonna have to publish it first."
                ]
              })()
            : ['A totally unexpected error just occurred. Please try again later.']

        openMenu(
          <>
            <DMHeader icon='cross'>Something went wrong...</DMHeader>
            <DMParagraphsZone className='w-120'>
              <DMParagraph>{errorMsg1}</DMParagraph>
              {errorMsg2 && <DMParagraph remark>{errorMsg2}</DMParagraph>}
            </DMParagraphsZone>
            <DMButton className='mt-2'>Okay, okay...</DMButton>
          </>
        )
      }
    })
  }, [])

  const buttonLabel = linkCopied
    ? 'Link copied!'
    : remoteCanvasId
      ? 'Copy share link'
      : 'Getting painting link...'
  const buttonIcon: IconName = linkCopied ? 'check' : 'clone'

  const handleClick = () => {
    if (!remoteCanvasId) return

    // Create url
    const { origin } = window.location
    const url = new URL(`${origin}/gallery`)
    url.searchParams.set('id', remoteCanvasId)

    // Copy url and close menu after a while
    setLinkCopied(true)
    navigator.clipboard.writeText(url.href)
    startTimeout(closeMenu, 500)
  }

  return (
    <>
      <DMHeader icon='share'>Share your painting</DMHeader>
      <DMZone className='w-120'>
        <DMParagraphsZone className='w-full'>
          <DMParagraph>You can share this awesome painting with others!</DMParagraph>
          <DMParagraph remark className='flex-row'>
            Share and flex what you did.
          </DMParagraph>
        </DMParagraphsZone>
        <DMCanvasImage dataUrl={dataUrl} />
      </DMZone>
      <DMButton
        className='mt-3'
        icon={buttonIcon}
        isLoading={!remoteCanvasId}
        onClick={handleClick}
        disabled={linkCopied}
        preventAutoClose
      >
        {buttonLabel}
      </DMButton>
    </>
  )
}
