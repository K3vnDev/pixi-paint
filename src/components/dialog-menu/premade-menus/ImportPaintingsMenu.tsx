import type { JSONCanvas, SavedCanvas } from '@types'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { DMButton } from '../DMButton'
import { DMDragNDrop } from '../DMDragNDrop'
import { DMHeader } from '../DMHeader'

interface Props {
  closeMenu: () => void
}

export const ImportPaintingsMenu = ({ closeMenu }: Props) => {
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)
  const savedCanvasesRef = useFreshRefs(useCanvasesStore(s => s.savedCanvases))
  const refreshUserPublishedIds = useRemoteStore(s => s.refreshUPI)

  const onDropOrSelect = (contents: string[]) => {
    const jsonCanvases: JSONCanvas[] = []

    // Parse and contents into an one level array
    for (const content of contents) {
      try {
        const raw: JSONCanvas | JSONCanvas[] = JSON.parse(content)
        Array.isArray(raw) ? jsonCanvases.push(...raw) : jsonCanvases.push(raw)
      } catch (err) {
        console.error('Tried to import an invalid file!', err)
      }
    }

    // Filter valid imported canvases
    const importedCanvases: SavedCanvas[] = canvasParser.batch.fromStorage(jsonCanvases)

    // Log warning for invalid ones
    const invalidCanvasesCount = jsonCanvases.length - importedCanvases.length
    if (invalidCanvasesCount) {
      console.warn(
        `${invalidCanvasesCount} of the imported paintings were not valid so we are skipping them...`
      )
    }

    setSavedCanvases(s => [...s, ...importedCanvases])
    closeMenu()

    // Refresh user published canvases ids
    requestAnimationFrame(() => {
      refreshUserPublishedIds(savedCanvasesRef.current)
    })
  }

  return (
    <>
      <DMHeader icon='code' className='border-none mb-0'>
        Paintings importer
      </DMHeader>
      <DMDragNDrop
        className='max-w-128 w-full my-1 md:px-10 px-4'
        acceptedFormats={['application/json']}
        allowMultipleFiles
        {...{ onDropOrSelect }}
      >
        Drag & Drop compatible JSON files here, or click to choose...
      </DMDragNDrop>
      <DMButton icon='cross' empty className='mt-4'>
        Nah, I'm good
      </DMButton>
    </>
  )
}
