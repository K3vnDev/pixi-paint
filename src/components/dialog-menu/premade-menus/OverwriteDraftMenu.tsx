import { DMParagraphsZone } from '@@/dialog-menu/DMParagraphsZone'
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
  pixels: string[]
  header?: string
  paragraph1?: string
  paragraph2?: string
  goodOption: Option
  badOption: Option
}

export const OverwriteDraftMenu = ({
  pixels,
  header = 'Overwrite your draft?',
  paragraph1 = "You've got this unsaved painting on your draft.",
  paragraph2 = 'Cloning into it will overwrite it.',
  goodOption,
  badOption
}: Props) => (
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
