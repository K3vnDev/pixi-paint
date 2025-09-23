import { CLICK_BUTTON, SPRITES_RESOLUTION } from '@consts'
import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useOverwriteDraft } from '@/hooks/useOverwriteDraft'
import { useSaveHandler } from '@/hooks/useSaveHandler'
import { useTimeout } from '@/hooks/useTimeout'
import { useTooltip } from '@/hooks/useTooltip'
import { usePaintStore } from '@/store/usePaintStore'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { OverwriteDraftMenu } from '../dialog-menu/premade-menus/OverwriteDraftMenu'
import { PixelatedImage } from '../PixelatedImage'
import { Item } from './Item'

interface Props {
  spriteSize: number
}

export const SaveHandler = ({ spriteSize }: Props) => {
  const { createNewSave, newBlankDraftAction, refs, isDraft, elementRef } = useSaveHandler()

  const { startTimeout, stopTimeout } = useTimeout()
  const [hasRecentlySaved, setHasRecentlySaved] = useState(false)
  const RECENTLY_SAVED_TIME = 500

  const editingPixels = usePaintStore(s => s.pixels)
  const { canOverwriteDraft, overwriteDraft, saveDraft } = useOverwriteDraft(editingPixels)

  const { throwConfetti } = useConfetti({
    ref: elementRef,
    options: { particleCount: 13, startVelocity: 15, spread: 70, ticks: 70 }
  })

  const { openMenu: openDialogMenu } = useDialogMenu()

  const cloneToNewDraft = () => {
    const { draft } = refs.current
    const cantOverrideDraft = !canOverwriteDraft(editingPixels)

    if (cantOverrideDraft) {
      openDialogMenu(
        <OverwriteDraftMenu
          pixels={draft.pixels}
          goodOption={{
            label: 'Save it, then clone',
            action: () => {
              saveDraft()
              overwriteDraft(true)
            }
          }}
          badOption={{
            label: 'Yes, overwrite it',
            action: () => overwriteDraft(true)
          }}
        />
      )
    } else {
      overwriteDraft(true)
    }
  }

  const newBlankDraft = () => {
    const { draft } = refs.current
    const cantOverrideDraft = !canOverwriteDraft(editingPixels)

    if (cantOverrideDraft) {
      openDialogMenu(
        <OverwriteDraftMenu
          header='Erase your draft?'
          paragraph2='Creating a new blank draft will erase it.'
          pixels={draft.pixels}
          goodOption={{
            action: () => {
              saveDraft()
              newBlankDraftAction()
            },
            label: 'Save it, then clear'
          }}
          badOption={{ action: newBlankDraftAction, label: 'Just erase it' }}
        />
      )
    } else {
      newBlankDraftAction()
    }
  }

  const { menuIsOpen: ctxMenuIsOpen } = useContextMenu({
    options: [
      { label: 'Clone to new draft', icon: 'clone', action: cloneToNewDraft },
      { label: 'New blank draft', icon: 'pencil', action: newBlankDraft }
    ],
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT],
    ref: elementRef,
    showWhen: !isDraft && !hasRecentlySaved
  })

  const tooltipText = isDraft ? 'Click to save...' : 'Painting saved!'
  useTooltip({ ref: elementRef, text: tooltipText, showWhen: !ctxMenuIsOpen })

  const handleClick = () => {
    if (isDraft) {
      setHasRecentlySaved(true)
      createNewSave()

      startTimeout(() => {
        setHasRecentlySaved(false)
        stopTimeout()
      }, RECENTLY_SAVED_TIME)

      throwConfetti()
    }
  }

  const [colorOverride, checkOverride] = isDraft
    ? ['', 'opacity-0 scale-60']
    : ['bg-theme-20/40 outline-theme-20', '']

  const checkSize = spriteSize * 0.8

  return (
    <Item
      onClick={handleClick}
      className={`
        flex items-center justify-center relative
        not-lg:ml-2 ${colorOverride}
      `}
      ref={elementRef}
    >
      <PixelatedImage
        resolution={SPRITES_RESOLUTION}
        src='/imgs/save.png'
        imageSize={spriteSize}
        alt='Save icon'
      />
      <ColoredPixelatedImage
        icon='check'
        className={`
          absolute bg-theme-10 left-1/2 top-1/2 -translate-1/3
          transition-all duration-200 ${checkOverride}
        `}
        style={{
          width: `${checkSize}px`,
          height: `${checkSize}px`
        }}
      />
    </Item>
  )
}
