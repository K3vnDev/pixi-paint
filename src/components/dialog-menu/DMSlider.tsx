import type { ReusableComponent } from '@types'
import { DMLabel } from './DMLabel'

type Props = {
  value: number
  onChange?: (value: number) => void
  valueDisplayParser?: (value: number) => string | number
  valuesLength: number
  label: string
  disabled?: boolean
} & ReusableComponent

export const DMSlider = ({
  value,
  onChange,
  valueDisplayParser,
  label,
  valuesLength,
  className = '',
  disabled = false,
  ...props
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(+e.target.value)
  const positionPerc = (value / (valuesLength - 1)) * 100
  const opacity = disabled ? 'opacity-40 brightness-50' : ''

  return (
    <div className={`flex md:gap-8 gap-4 items-center w-full ${opacity} ${className}`} {...props}>
      <DMLabel>{label}</DMLabel>

      <div className='w-full h-12 flex items-center relative'>
        <input
          className='w-full h-full opacity-0'
          type='range'
          min={0}
          max={valuesLength - 1}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />

        {/* Background */}
        <div
          className={`
            absolute bg-theme-20 border-2 border-theme-10/20 h-4 w-full rounded-full 
            overflow-clip pointer-events-none
          `}
        >
          <div className='bg-theme-10 h-full' style={{ width: `${positionPerc}%` }} />
        </div>

        {/* Handler */}
        <div
          className='absolute bg-theme-10 size-[28px] z-50 aspect-square rounded-full pointer-events-none'
          style={{ left: `calc(${positionPerc}% - 14px)` }}
        />
      </div>

      {valueDisplayParser && (
        <span
          className={`
            md:w-40 w-32 bg-black/30 text-lg text-theme-10 flex items-center justify-center 
            rounded-full font-semibold font-mono
          `}
        >
          {valueDisplayParser(value)}
        </span>
      )}
    </div>
  )
}
