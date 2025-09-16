'use client'

import type { IconName } from '@types'
import { useEffect, useState } from 'react'
import { useEvent } from '@/hooks/useEvent'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useTimeout } from '@/hooks/useTimeout'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { generateId } from '@/utils/generateId'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMZone } from '../dialog-menu/DMZone'

interface Props {
  id: string
  dataUrl: string
  pixels: string[]

  closeMenu: () => void
  openInDraft: () => void
}

export const CanvasViewMenu = ({ dataUrl, id, closeMenu, pixels, openInDraft }: Props) => {
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(true)

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)
  const publishedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setUserPublishedCanvasesIds = useRemoteStore(s => s.setUserPublishedIds)

  const refs = useFreshRefs({ id, pixels, savedCanvases, publishedCanvases })
  const { startTimeout, stopTimeout } = useTimeout()

  const copyShareLink = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('id', id)

    navigator.clipboard.writeText(url.href)

    setShareLinkCopied(true)
    const index = startTimeout(() => {
      setShareLinkCopied(false)
      stopTimeout(index)
    }, 1500)
  }

  useEvent('$dialog-menu-closed', () => stopTimeout())

  const shareLinkButtonData: ButtonData = shareLinkCopied
    ? { icon: 'check', text: 'Share link copied!' }
    : { icon: 'share', text: 'Copy share link' }

  const refreshSaveDisabled = () => {
    setTimeout(() => {
      const { savedCanvases, pixels } = refs.current
      const isAlreadySaved = savedCanvases.some(s => pixelsComparison(s.pixels, pixels))
      setSaveDisabled(!!isAlreadySaved)
    }, 33)
  }

  useEffect(refreshSaveDisabled, [])
  useEvent('$open-dialog-menu', refreshSaveDisabled)

  const saveToMyCreations = () => {
    setSaveDisabled(true)
    const { pixels } = refs.current

    if (pixels) {
      const newCanvas = { id: generateId(), pixels }
      setSavedCanvases(s => [newCanvas, ...s])
      startTimeout(closeMenu, 450)

      // Add new id to user published canvases ids
      requestAnimationFrame(() => {
        const { id } = refs.current.savedCanvases[0]
        setUserPublishedCanvasesIds(ids => ids?.add(id))
      })
    }
  }

  const saveToMyCreationsButtonData: ButtonData = saveDisabled
    ? { icon: 'check', text: 'In your creations!' }
    : { icon: 'save', text: 'Save to my creations' }

  return (
    <DMZone className='gap-16 items-start relative'>
      <DMZone className='flex-col items-start'>
        <DMHeader icon='publish' className='pl-0'>
          Community painting
        </DMHeader>
        <DMButton
          icon={shareLinkButtonData.icon}
          onClick={copyShareLink}
          disabled={shareLinkCopied}
          preventAutoClose
        >
          {shareLinkButtonData.text}
        </DMButton>
        <DMButton icon='pencil' onClick={openInDraft} preventAutoClose>
          Open in draft
        </DMButton>
        <DMButton
          icon={saveToMyCreationsButtonData.icon}
          disabled={saveDisabled}
          onClick={saveToMyCreations}
          preventAutoClose
        >
          {saveToMyCreationsButtonData.text}
        </DMButton>
        <DMButton icon='cross' empty>
          Close
        </DMButton>
      </DMZone>
      <DMCanvasImage className='size-99' dataUrl={dataUrl} />
    </DMZone>
  )
}

interface ButtonData {
  icon: IconName
  text: string
}
