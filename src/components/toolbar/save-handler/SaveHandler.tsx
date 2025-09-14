import { CLICK_BUTTON, SPRITES_RESOLUTION, SPRITES_SIZE } from '@consts'
import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useSaveHandler } from '@/hooks/useSaveHandler'
import { useTimeout } from '@/hooks/useTimeout'
import { useTooltip } from '@/hooks/useTooltip'
import { isCanvasEmpty } from '@/utils/isCanvasEmpty'
import { ColoredPixelatedImage } from '../../ColoredPixelatedImage'
import { PixelatedImage } from '../../PixelatedImage'
import { Item } from '../Item'
import { WarningMenu } from './WarningMenu'

export const SaveHandler = () => {
  const { cloneToNewDraftAction, createNewSave, newBlankDraftAction, saveDraft, refs, isDraft, elementRef } =
    useSaveHandler()

  const { startTimeout, stopTimeout } = useTimeout()
  const [hasRecentlySaved, setHasRecentlySaved] = useState(false)
  const RECENTLY_SAVED_TIME = 500

  const { throwConfetti } = useConfetti({
    ref: elementRef,
    options: { particleCount: 13, startVelocity: 15, spread: 70, ticks: 70 }
  })

  const { openMenu: openDialogMenu } = useDialogMenu()

  const cloneToNewDraft = () => {
    const { draft } = refs.current
    const draftIsNotEmpty = !isCanvasEmpty(draft)

    if (draftIsNotEmpty) {
      openDialogMenu(
        <WarningMenu
          header='Overwrite your draft?'
          paragraph1="You've got this unsaved painting on your draft."
          paragraph2='Cloning into it will overwrite it.'
          pixels={draft.pixels}
          goodOption={{
            label: 'Save it, then clone',
            action: () => {
              saveDraft()
              cloneToNewDraftAction()
            }
          }}
          badOption={{ label: 'Yes, overwrite it', action: cloneToNewDraftAction }}
        />
      )
    } else {
      cloneToNewDraftAction()
    }
  }

  const newBlankDraft = () => {
    const { draft } = refs.current

    if (!isCanvasEmpty(draft)) {
      openDialogMenu(
        <WarningMenu
          header='Erase your draft?'
          paragraph1="You've got this unsaved painting on your draft."
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

  return (
    <Item className={`flex items-center justify-center relative ${colorOverride}`} ref={elementRef}>
      <button className='px-2' onClick={handleClick}>
        <PixelatedImage
          resolution={SPRITES_RESOLUTION}
          src='/imgs/save.png'
          imageSize={SPRITES_SIZE}
          alt='Save icon'
        />
        <ColoredPixelatedImage
          icon='check'
          className={`
            absolute size-20 bg-theme-10 left-1/2 top-1/2 -translate-1/3
            transition-all duration-200 ${checkOverride}
          `}
        />
      </button>
    </Item>
  )
}
