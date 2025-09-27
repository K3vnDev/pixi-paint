import type { IconName } from '@/types'
import { DMButton } from '../DMButton'
import { DMHeader } from '../DMHeader'
import { DMParagraph } from '../DMParagraph'
import { DMParagraphsZone } from '../DMParagraphsZone'

interface Props {
  header: IconText
  paragraph1: string
  paragraph2?: string
  button: IconText
}

interface IconText {
  icon?: IconName
  label: string
}

export const DefaultErrorMenu = ({ header, paragraph1, paragraph2, button }: Props) => (
  <>
    <DMHeader icon={header.icon}>{header.label}</DMHeader>
    <DMParagraphsZone className='max-w-xl w-full'>
      <DMParagraph>{paragraph1}</DMParagraph>
      {paragraph2 && <DMParagraph remark>{paragraph2}</DMParagraph>}
    </DMParagraphsZone>
    <DMButton icon={button.icon}>{button.label}</DMButton>
  </>
)
