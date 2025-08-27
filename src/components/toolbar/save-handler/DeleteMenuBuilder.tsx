import { DMButton } from '@/components/dialog-menu/DMButton'
import { DMCanvasImage } from '@/components/dialog-menu/DMCanvasImage'
import { DMHeader } from '@/components/dialog-menu/DMHeader'
import { DMParagraph } from '@/components/dialog-menu/DMParagraph'
import { DMZone } from '@/components/dialog-menu/DMZone'
import { DMZoneButtons } from '@/components/dialog-menu/DMZoneButtons'

interface Option {
  label: string
  action: () => void
}

interface Props {
  goodOption: Option
  badOption: Option
  pixels: string[]
  header: string
  paragraph: string
}

export const DeleteMenuBuilder = ({ header, paragraph, pixels, goodOption, badOption }: Props) => (
  <>
    <DMHeader icon='warning'>{header}</DMHeader>
    <DMZone className='pt-2 pb-0 items-start gap-8'>
      <DMParagraph className='w-96'>{paragraph}</DMParagraph>
      <DMCanvasImage pixels={pixels} />
    </DMZone>
    <DMZoneButtons>
      <DMButton icon='trash' empty onClick={badOption.action}>
        {badOption.label}
      </DMButton>
      <DMButton icon='save' onClick={goodOption.action}>
        {goodOption.label}
      </DMButton>
    </DMZoneButtons>
  </>
)
