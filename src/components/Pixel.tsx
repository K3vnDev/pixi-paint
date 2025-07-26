import { usePaintStore } from '@/store/usePaintStore'

interface Props {
	color: string
	index: number
}

export const Pixel = ({ color, index }: Props) => {
	// const mode = usePaintStore(s => s.mode)
	const selectedColor = usePaintStore(s => s.color)
	const setCanvasPixel = usePaintStore(s => s.setCanvasPixel)

	const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault()

		if (e.buttons === 1) {
			// TODO: Check for mode too
			setCanvasPixel({ color: selectedColor }, index)
			console.log('Paiting at', index)
		}
	}

	return (
		<div
			className='w-full aspect-square cursor-pointer p-[3px] active:p-0.5 active:brightness-110 transition-all'
			// TODO: The animation should be controlled on paint and not on click
			onPointerEnter={handlePointerEnter}
			onPointerDown={handlePointerEnter}
			draggable={false}
		>
			<div className='size-full transition duration-75 rounded-[1.5px]' style={{ background: color }}></div>
		</div>
	)
}
