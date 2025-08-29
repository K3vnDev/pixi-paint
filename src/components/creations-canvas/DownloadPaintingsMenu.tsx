import { DMButton } from '@@/dialog-menu/DMButton'
import { DMHeader } from '@@/dialog-menu/DMHeader'
import { DMParagraph } from '@@/dialog-menu/DMParagraph'
import { DMRadio } from '@@/dialog-menu/DMRadio'
import { useState } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { canvasParser } from '@/utils/canvasParser'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'

interface Props {
  canvasId: string
}

export const DownloadPaintingsMenu = ({ canvasId }: Props) => {
  const [radioIndex, setRadioIndex] = useState(0)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)

  const handleSelect = (index: number) => {
    setRadioIndex(index)
  }

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

    if (radioIndex === 0) {
      // Download png
      const dataUrl = getPixelsDataUrl(canvas.pixels, { type: 'image/png', scale: 64 })
      downloadUtility(dataUrl, 'my-cool-painting.png')
    } else {
      // Download json
      const { id: _, ...parsed } = canvasParser.toStorage(canvas)
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      downloadUtility(url, 'my-cool-painting.json')
    }
  }

  return (
    <>
      <DMHeader icon='download'>Paintings downloader</DMHeader>
      <DMParagraph className='w-128 mb-4'>
        Download your paintings. JSON files can be imported back later.
      </DMParagraph>

      <DMRadio
        label='Format'
        className='w-full'
        selectedIndex={radioIndex}
        onSelect={handleSelect}
        options={[
          { icon: 'image', label: 'PNG' },
          { icon: 'code', label: 'JSON' }
        ]}
      />
      <DMButton icon='download' className='mt-10' onClick={download}>
        Download
      </DMButton>
    </>
  )
}
