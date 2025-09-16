'use client'

import type { IconName } from '@types'
import { useState } from 'react'
import { useTimeout } from '@/hooks/useTimeout'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMZone } from '../dialog-menu/DMZone'

interface Props {
  dataUrl: string
  id: string
}

export const CanvasViewMenu = ({ dataUrl, id }: Props) => {
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const { startTimeout } = useTimeout()

  const copyShareLink = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('id', id)

    navigator.clipboard.writeText(url.href)

    setShareLinkCopied(true)
    startTimeout(() => {
      setShareLinkCopied(false)
    }, 1500)
  }

  const shareLinkButtonData: ShareLinkButtonData = shareLinkCopied
    ? { icon: 'check', text: 'Share link copied!' }
    : { icon: 'share', text: 'Copy share link' }

  return (
    <DMZone className='gap-16 items-start relative'>
      <DMZone className='flex-col items-start'>
        <DMHeader icon='heart' className='pl-0'>
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
        <DMButton icon='pencil'>Open in draft</DMButton>
        <DMButton icon='clone'>Clone to my creations</DMButton>
        <DMButton icon='cross' empty>
          Close
        </DMButton>
      </DMZone>
      <DMCanvasImage className='size-99' dataUrl={dataUrl} />
    </DMZone>
  )
}

interface ShareLinkButtonData {
  icon: IconName
  text: string
}
