'use client'

import type { IconName } from '@types'
import { useEffect, useState } from 'react'
import { useTimeout } from '@/hooks/timer-handlers/useTimeout'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { generateId } from '@/utils/generateId'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { DMButton, type Props as DMButtonProps } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'

interface Props {
  id: string
  dataUrl: string
  pixels: string[]
  verticalMode: boolean

  closeMenu: () => void
  openInDraft: () => void
}

export const CommunityCanvasViewMenu = ({
  dataUrl,
  id,
  closeMenu,
  pixels,
  openInDraft,
  verticalMode
}: Props) => {
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

  const refreshSaveDisabled = () => {
    setTimeout(() => {
      const { savedCanvases, pixels } = refs.current
      const isAlreadySaved = savedCanvases.some(s => pixelsComparison(s.pixels, pixels))
      setSaveDisabled(!!isAlreadySaved)
    }, 33)
  }

  useEffect(refreshSaveDisabled, [])

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

  const shareLinkButtonData: ButtonData = shareLinkCopied
    ? { icon: 'check', text: 'Share link copied!' }
    : { icon: 'share', text: 'Copy share link' }

  const saveToMyCreationsButtonData: ButtonData = saveDisabled
    ? { icon: 'check', text: 'In your creations!' }
    : { icon: 'save', text: 'Save to my creations' }

  const buttons: DMButtonProps[] = [
    {
      icon: shareLinkButtonData.icon,
      children: shareLinkButtonData.text,
      onClick: copyShareLink,
      disabled: shareLinkCopied,
      preventAutoClose: true
    },
    {
      icon: 'pencil',
      children: 'Open in draft',
      onClick: openInDraft,
      preventAutoClose: true
    },
    {
      icon: saveToMyCreationsButtonData.icon,
      children: saveToMyCreationsButtonData.text,
      disabled: saveDisabled,
      onClick: saveToMyCreations,
      preventAutoClose: true
    },
    {
      icon: 'cross',
      children: 'Close',
      empty: true,
      onClick: closeMenu
    }
  ]

  return verticalMode ? (
    <DMZone>
      <Header />
      <DMCanvasImage className='size-48' dataUrl={dataUrl} />
      <Buttons buttonsData={buttons} />
    </DMZone>
  ) : (
    <DMZone className='gap-16 items-start'>
      <DMZone className='flex-col items-start'>
        <Header />
        <Buttons buttonsData={buttons} />
      </DMZone>
      <DMCanvasImage className='md:size-100' dataUrl={dataUrl} />
    </DMZone>
  )
}

const Header = () => (
  <DMHeader icon='publish' className='pl-0'>
    Community painting
  </DMHeader>
)

const Buttons = ({ buttonsData }: { buttonsData: DMButtonProps[] }) => {
  return (
    <DMZoneButtons className='not-md:flex-col md:flex-col md:items-start'>
      {buttonsData.map((btn, i) => (
        <DMButton key={i} {...btn} />
      ))}
    </DMZoneButtons>
  )
}

interface ButtonData {
  icon: IconName
  text: string
}
