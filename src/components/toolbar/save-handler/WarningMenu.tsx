import { DMButton } from '@dialog-menu/DMButton'
import { DMCanvasImage } from '@dialog-menu/DMCanvasImage'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMZone } from '@dialog-menu/DMZone'
import { DMZoneButtons } from '@dialog-menu/DMZoneButtons'
import { DMParagraphsZone } from '@/components/dialog-menu/DMParagraphsZone'

interface Option {
  label: string
  action: () => void
}

interface Props {
  goodOption: Option
  badOption: Option
  pixels: string[]
  header: string
  paragraph1: string
  paragraph2: string
}

export const WarningMenu = ({ header, paragraph1, paragraph2, pixels, goodOption, badOption }: Props) => (
  <>
    <DMHeader icon='warning'>{header}</DMHeader>
    <DMZone className='pt-2 pb-0 items-start gap-8'>
      <DMParagraphsZone className='w-96'>
        <DMParagraph>{paragraph1}</DMParagraph>
        <DMParagraph remark>{paragraph2}</DMParagraph>
      </DMParagraphsZone>
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
