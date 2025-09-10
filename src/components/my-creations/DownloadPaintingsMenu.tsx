import { LS_KEYS } from '@consts'
import { DMButton } from '@dialog-menu/DMButton'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMRadio } from '@dialog-menu/DMRadio'
import { DMSlider } from '@dialog-menu/DMSlider'
import type { DownloadSettings, JSONCanvas } from '@types'
import JSZip from 'jszip'
import { useEffect, useState } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { canvasParser } from '@/utils/canvasParser'
import { getLocalStorageItem } from '@/utils/getLocalStorageItem'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'

interface Props {
  canvasesIds: string[]
}

export const DownloadPaintingsMenu = ({ canvasesIds }: Props) => {
  const initState = getLocalStorageItem<DownloadSettings>(LS_KEYS.DOWNLOAD_SETTINGS, {
    formatIndex: 0,
    sizeIndex: 0
  })

  const [formatIndex, setFormatIndex] = useState(initState.formatIndex)
  const [sizeIndex, setSizeIndex] = useState(initState.sizeIndex)

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const SIZES = [8, 16, 32, 64, 128, 256, 512, 1024]
  const formatIsPNG = formatIndex === 0

  useEffect(() => {
    const item: DownloadSettings = { formatIndex, sizeIndex }
    window.localStorage.setItem(LS_KEYS.DOWNLOAD_SETTINGS, JSON.stringify(item))
  }, [formatIndex, sizeIndex])

  const download = async () => {
    const downloadUtility = (url: string, filename: string) => {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    // Find the corresponding saved canvas for each id
    const savedPixelsMap: Record<string, string[]> = {}
    savedCanvases.forEach(({ id, pixels }) => {
      savedPixelsMap[id] = pixels
    })
    const canvasesPixels: string[][] = []
    for (const canvasId of canvasesIds) {
      canvasesPixels.push(savedPixelsMap[canvasId])
    }

    const fileName = 'my-cool-painting'
    const singleCanvas = canvasesPixels.length === 1
    const s = singleCanvas ? '' : 's'

    // Don't proceed if no canvas was added
    if (!canvasesPixels.length) return

    if (formatIsPNG) {
      // Download png's
      const scale = SIZES[sizeIndex] / 8
      const type = 'image/png'
      const dataUrls = canvasesPixels.map(p => getPixelsDataUrl(p, { type, scale }))

      if (dataUrls.length === 1) {
        // Download one single png
        downloadUtility(dataUrls[0], `${fileName}.png`)
      } else {
        // Download multiple png's in a zip file
        const zip = new JSZip()

        dataUrls.forEach((dataUrl, index) => {
          // Convert DataURL to binary blob
          const base64 = dataUrl.split(',')[1]
          if (!base64) return

          const binary = atob(base64)
          const bytes = new Uint8Array(binary.length)

          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

          // Add to ZIP as "image-1.png", "image-2.png", etc.
          zip.file(`${fileName}-${index + 1}.png`, bytes)
        })

        // Generate and download the ZIP
        const generatedZip = await zip.generateAsync({ type: 'blob' })
        const zipUrl = URL.createObjectURL(generatedZip)
        downloadUtility(zipUrl, `${fileName}s.zip`)
      }
    } else {
      // Download json
      const jsonCanvases: JSONCanvas[] = []
      canvasesPixels.forEach((pixels, i) => {
        const parsed = canvasParser.toStorage({ id: i.toString(), pixels })
        if (!parsed) return

        const { id: _, ...json } = parsed
        jsonCanvases.push(json)
      })

      // Prevent single element arrays
      const downloadJson = singleCanvas ? jsonCanvases[0] : jsonCanvases

      // Create URL and download
      const blob = new Blob([JSON.stringify(downloadJson, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      downloadUtility(url, `${fileName}${s}.json`)
    }
  }

  const title = canvasesIds.length <= 1 ? 'Download Painting' : 'Download Paintings'
  const paragraph1 =
    canvasesIds.length <= 1 ? 'Export your painting.' : `Export the selected ${canvasesIds.length} paintings.`
  const paragraph2 = ' JSON files can be imported back later.'
  const buttonLabel = formatIsPNG && canvasesIds.length > 1 ? 'Download ZIP' : 'Download'

  return (
    <>
      <DMHeader icon='download'>{title}</DMHeader>
      <DMParagraph className='w-128 mb-4'>{paragraph1 + paragraph2}</DMParagraph>

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
        disabled={!formatIsPNG}
      />

      <DMButton icon='download' className='mt-5' onClick={download}>
        {buttonLabel}
      </DMButton>
    </>
  )
}
