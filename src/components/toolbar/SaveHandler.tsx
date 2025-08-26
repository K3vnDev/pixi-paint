import { BLANK_DRAFT, CLICK_BUTTON, COLOR_PALETTE, SPRITES_RESOLUTION, SPRITES_SIZE } from '@consts'
import { useRef, useState } from 'react'
import { useBucketPixels } from '@/hooks/useBucketPixels'
import { useConfetti } from '@/hooks/useConfetti'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useTimeout } from '@/hooks/useTimeout'
import { useTooltip } from '@/hooks/useTooltip'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { isCanvasEmpty } from '@/utils/isCanvasEmpty'
import { ColoredPixelatedImage } from '../ColoredPixelatedImage'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'
import { PixelatedImage } from '../PixelatedImage'
import { Item } from './Item'

export const SaveHandler = () => {
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)
  const setDraft = useCanvasStore(s => s.setDraftCanvas)
  const draft = useCanvasStore(s => s.draftCanvas)
  const paintPixels = usePaintStore(s => s.paintPixels)

  const editingPixels = usePaintStore(s => s.pixels)
  const isDraft = editingCanvasId === null
  const elementRef = useRef<HTMLElement>(null)
  const { paintBucketPixels } = useBucketPixels()

  const refs = useFreshRefs({ editingPixels, draft })

  const { startTimeout, stopTimeout } = useTimeout()
  const [hasRecentlySaved, setHasRecentlySaved] = useState(false)
  const RECENTLY_SAVED_TIME = 500

  const { throwConfetti } = useConfetti({
    ref: elementRef,
    options: { particleCount: 13, startVelocity: 15, spread: 70, ticks: 70 }
  })

  const { openMenu } = useDialogMenu()

  const saveDraft = () => {
    const newCanvasId = getNewCanvasId()
    const savingCanvas = { id: newCanvasId, pixels: refs.current.draft.pixels }
    setSavedCanvases([...savedCanvases, savingCanvas])
  }

  const cloneToNewDraft = () => {
    const { draft, editingPixels } = refs.current
    const draftIsNotEmpty = !isCanvasEmpty(draft)

    const cloneToNewDraftAction = () => {
      setEditingCanvasId(null)
      setDraft({ ...BLANK_DRAFT, pixels: editingPixels })
    }

    if (draftIsNotEmpty) {
      openMenu(
        <>
          <DMHeader icon='warning'>Overwrite your draft?</DMHeader>
          <DMZone className='pt-2 pb-0 items-start gap-5'>
            <DMParagraph className='w-96'>
              You've got this unsaved painting on your draft.
              <br /> <br />
              Cloning into it will overwrite it.
            </DMParagraph>
            <DMCanvasImage pixels={draft.pixels} />
          </DMZone>
          <DMZoneButtons>
            <DMButton icon='trash' empty onClick={cloneToNewDraftAction}>
              Yes, overwrite it
            </DMButton>
            <DMButton
              icon='check'
              onClick={() => {
                saveDraft()
                cloneToNewDraftAction()
              }}
            >
              Save it, then clone
            </DMButton>
          </DMZoneButtons>
        </>
      )
    } else {
      cloneToNewDraftAction()
    }
  }

  const createNewSave = () => {
    const newCanvasId = getNewCanvasId()
    const savingCanvas = { id: newCanvasId, pixels: refs.current.editingPixels }

    setSavedCanvases([...savedCanvases, savingCanvas])
    setEditingCanvasId(newCanvasId)
    setDraft({ ...BLANK_DRAFT })
  }

  const newBlankDraft = () => {
    const { draft } = refs.current

    const newBlankDraftAction = () => {
      setEditingCanvasId(null)
      setDraft({ ...BLANK_DRAFT })

      paintBucketPixels({
        startIndexes: calcMiddlePixelsIndexes(),
        paintGenerationAction: generation => {
          paintPixels(...generation.map(({ index }) => ({ color: COLOR_PALETTE.WHITE, index })))
        }
      })
    }

    if (!isCanvasEmpty(draft)) {
      openMenu(
        <>
          <DMHeader icon='warning'>Erase your draft?</DMHeader>
          <DMZone className='pt-2 pb-0 items-start gap-5'>
            <DMParagraph className='w-96'>
              You've got this unsaved painting on your draft.
              <br /> <br />
              Continuing will erase it.
            </DMParagraph>
            <DMCanvasImage pixels={draft.pixels} />
          </DMZone>
          <DMZoneButtons>
            <DMButton icon='trash' empty onClick={newBlankDraftAction}>
              Yes, erase it
            </DMButton>
            <DMButton
              icon='check'
              onClick={() => {
                saveDraft()
                newBlankDraftAction()
              }}
            >
              Save it, then clear
            </DMButton>
          </DMZoneButtons>
        </>
      )
    } else {
      newBlankDraftAction()
    }
  }

  const { menuIsOpen } = useContextMenu({
    options: [
      { label: 'Clone to new draft', icon: 'clone', action: cloneToNewDraft },
      { label: 'New blank draft', icon: 'pencil', action: newBlankDraft }
    ],
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT],
    ref: elementRef,
    showWhen: !isDraft && !hasRecentlySaved
  })

  const tooltipText = isDraft ? 'Click to save...' : 'Painting saved!'
  useTooltip({ ref: elementRef, text: tooltipText, showWhen: !menuIsOpen })

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
