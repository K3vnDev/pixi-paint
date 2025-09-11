import { ColoredPixelatedImage } from '../ColoredPixelatedImage'

interface Props {
  canvasIsSelected: boolean
}

export const SelectionBox = ({ canvasIsSelected }: Props) => {
  const selectedState = canvasIsSelected ? 'scale-110' : 'opacity-0 scale-150 blur-xl'

  return (
    <div
      className={`
        absolute right-[var(--creations-canvas-pad)] top-[var(--creations-canvas-pad)]
        size-14 border-2 border-theme-10/50 flex items-center justify-center
        bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card animate-appear
      `}
    >
      <ColoredPixelatedImage
        icon='check'
        className={`size-full transition-all duration-200 ${selectedState}`}
      />
    </div>
  )
}
