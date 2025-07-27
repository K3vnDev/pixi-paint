interface Props {
  color: string
  index: number
}

export const Pixel = ({ color, index }: Props) => {
  return (
    <div
      className='w-full aspect-square cursor-pointer p-[2.5px] transition-all select-none'
      draggable={false}
      data-pixel-index={index}
    >
      <div
        className='size-full transition duration-[50ms] rounded-[2px] pointer-events-none'
        style={{ background: color }}
      />
    </div>
  )
}
