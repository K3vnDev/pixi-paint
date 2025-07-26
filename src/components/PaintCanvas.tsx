'use client'

import { PIXEL_ART_RES } from '@/consts'
import { usePaintStore } from '@/store/usePaintStore'
import { Pixel } from './Pixel'

export const PaintCanvas = () => {
	const canvas = usePaintStore(s => s.canvas)
	const gridTemplateColumns = `repeat(${PIXEL_ART_RES}, minmax(0, 1fr))`

	return (
		<div className='content-center size-[700px] grid' style={{ gridTemplateColumns }}>
			{canvas.map((pixel, i) => (
				<Pixel color={pixel.color} index={i} key={i} />
			))}
		</div>
	)
}
