import {
  BLANK_DRAFT,
  BUCKET_INTERVAL_TIME,
  CLICK_BUTTON,
  COLOR_PALETTE,
  SPRITES_RESOLUTION,
  SPRITES_SIZE
} from '@consts'

import { useRef, useState } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { usePaintBucketPixels } from '@/hooks/usePaintBucketPixels'
import { useTimeout } from '@/hooks/useTimeout'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { findBucketPixels } from '@/utils/findBucketPixels'
import { PixelatedImage } from '../PixelatedImage'
import { Item } from './Item'

export const SaveHandler = () => {
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)
  const setDraft = useCanvasStore(s => s.setDraftCanvas)
  const draftCanvas = useCanvasStore(s => s.draftCanvas)
  const paintPixels = usePaintStore(s => s.paintPixels)

  const editingPixels = usePaintStore(s => s.pixels)
  const isDraft = editingCanvasId === null
  const elementRef = useRef<HTMLElement>(null)
  const { paintBucketPixels } = usePaintBucketPixels()

  const { startTimeout, stopTimeout } = useTimeout()
  const [hasRecentlySaved, setHasRecentlySaved] = useState(false)
  const RECENTLY_SAVED_TIME = 500

  const cloneToNewDraft = () => {
    setEditingCanvasId(null)
    setDraft({ ...BLANK_DRAFT, pixels: editingPixels })
  }

  const newBlankDraft = () => {
    setEditingCanvasId(null)
    setDraft({ ...BLANK_DRAFT })

    const groupedGens = findBucketPixels({
      pixelsMap: draftCanvas.pixels,
      startIndexes: calcMiddlePixelsIndexes()
    })

    paintBucketPixels({
      groupedGens,
      intervalTime: BUCKET_INTERVAL_TIME,
      instantPaintFirstGen: true,
      paintGenAction: generation => {
        paintPixels(...generation.map(({ index }) => ({ color: COLOR_PALETTE.WHITE, index })))
      }
    })
  }

  useContextMenu({
    options: [
      { label: 'Clone to new draft', icon: 'clone', action: cloneToNewDraft },
      { label: 'New blank draft', icon: 'pencil', action: newBlankDraft }
    ],
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT],
    ref: elementRef,
    showWhen: !isDraft && !hasRecentlySaved
  })

  const createNewSave = () => {
    const newCanvasId = getNewCanvasId()
    const savingCanvas = { id: newCanvasId, pixels: editingPixels }

    setSavedCanvases([...savedCanvases, savingCanvas])
    setEditingCanvasId(newCanvasId)
    setDraft({ ...BLANK_DRAFT })
  }

  const handleClick = () => {
    if (isDraft) {
      setHasRecentlySaved(true)
      createNewSave()

      startTimeout(() => {
        setHasRecentlySaved(false)
        stopTimeout()
      }, RECENTLY_SAVED_TIME)
    }
  }

  const [image, colorOverride] = isDraft ? ['save', ''] : ['saved-check', 'bg-theme-20/40 outline-theme-20']

  return (
    <Item className={`flex items-center justify-center ${colorOverride}`} ref={elementRef}>
      <button className='px-2' onClick={handleClick}>
        <PixelatedImage
          resolution={SPRITES_RESOLUTION}
          src={`/imgs/save/${image}.png`}
          imageSize={SPRITES_SIZE}
          alt='Save icon'
        />
      </button>
    </Item>
  )
}
