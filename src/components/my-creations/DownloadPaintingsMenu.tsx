import { DMButton } from '@@/dialog-menu/DMButton'
import { DMHeader } from '@@/dialog-menu/DMHeader'
import { DMParagraph } from '@@/dialog-menu/DMParagraph'
import { DMRadio } from '@@/dialog-menu/DMRadio'
import { DMSlider } from '@@/dialog-menu/DMSlider'
import { LS_KEYS } from '@consts'
import type { DownloadSettings } from '@types'
import { useEffect, useState } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { canvasParser } from '@/utils/canvasParser'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'

interface Props {
  canvasId: string
}

export const DownloadPaintingsMenu = ({ canvasId }: Props) => {
  const initState = getLocalStorageItem<DownloadSettings>(LS_KEYS.DOWNLOAD_SETTINGS, {
    formatIndex: 0,
    sizeIndex: 0
  })

  const [formatIndex, setFormatIndex] = useState(initState.formatIndex)
  const [sizeIndex, setSizeIndex] = useState(initState.sizeIndex)

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const SIZES = [8, 16, 32, 64, 128, 256, 512, 1024]

  useEffect(() => {
    const item: DownloadSettings = { formatIndex, sizeIndex }
    window.localStorage.setItem(LS_KEYS.DOWNLOAD_SETTINGS, JSON.stringify(item))
  }, [formatIndex, sizeIndex])

  const download = () => {
    const downloadUtility = (url: string, filename: string) => {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const canvas = savedCanvases.find(c => c.id === canvasId)
    if (!canvas) return

    if (formatIndex === 0) {
      // Download png
      const scale = SIZES[sizeIndex] / 8
      const dataUrl = getPixelsDataUrl(canvas.pixels, { type: 'image/png', scale })
      downloadUtility(dataUrl, 'my-cool-painting.png')
    } else {
      // Download json
      const storageCanvas = canvasParser.toStorage(canvas)
      if (!storageCanvas) return

      const { id: _, ...parsed } = storageCanvas
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      downloadUtility(url, 'my-cool-painting.json')
    }
  }

  return (
    <>
      <DMHeader icon='download'>Paintings Downloader</DMHeader>
      <DMParagraph className='w-128 mb-4'>
        Export your paintings. JSON files can be imported back later.
      </DMParagraph>

      <DMRadio
        label='Format'
        className='w-full'
        selectedIndex={formatIndex}
        onSelect={setFormatIndex}
        options={[
          { icon: 'image', label: 'PNG' },
          { icon: 'code', label: 'JSON' }
        ]}
      />

      <DMSlider
        value={sizeIndex}
        onChange={setSizeIndex}
        valueDisplayParser={v => `${SIZES[v]}x`}
        label='Size'
        valuesLength={SIZES.length}
        disabled={!!formatIndex}
      />

      <DMButton icon='download' className='mt-5' onClick={download}>
        Download
      </DMButton>
    </>
  )
}
