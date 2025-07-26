interface Props {
  color: string
  index: number
}

export const Pixel = ({ color, index }: Props) => {
  return (
    <div
      className='w-full aspect-square cursor-pointer p-[3px] transition-all select-none'
      draggable={false}
      data-pixel-index={index}
    >
      <div
        className='size-full transition duration-75 rounded-[1.5px] pointer-events-none'
        style={{ background: color }}
      >
        {index}
      </div>
    </div>
  )
}
