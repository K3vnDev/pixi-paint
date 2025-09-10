import { DMButton } from '@dialog-menu/DMButton'
import { DMCanvasImage } from '@dialog-menu/DMCanvasImage'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMZone } from '@dialog-menu/DMZone'
import { DMZoneButtons } from '@dialog-menu/DMZoneButtons'

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

export const WarningMenu = ({ header, paragraph, pixels, goodOption, badOption }: Props) => (
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
