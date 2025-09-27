import { DMButton } from '@dialog-menu/DMButton'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMZoneButtons } from '@dialog-menu/DMZoneButtons'
import { DMParagraphsNCanvasImage } from '../DMParagraphsNCanvasImage'

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
    <DMParagraphsNCanvasImage pixels={pixels}>
      <DMParagraph>{paragraph1}</DMParagraph>
      <DMParagraph remark>{paragraph2}</DMParagraph>
    </DMParagraphsNCanvasImage>

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
