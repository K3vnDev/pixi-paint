import { repeat } from '@/utils/repeat'

export const Separator = () => (
  <div className='w-full my-2.5 flex gap-3 justify-center'>
    {repeat(3, i => (
      <div key={i} className='size-2.5  rounded-full bg-white/10' />
    ))}
  </div>
)
