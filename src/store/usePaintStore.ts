import type { Pixel } from '@types'
import { create } from 'zustand'
import { MODES, PIXEL_ART_RES } from '@/consts'

interface PaintStore {
	mode: MODES
	setMode: (value: MODES) => void

	color: string
	setColor: (value: string) => void

	canvas: Pixel[]
	setCanvas: (value: Pixel[]) => void
	setCanvasPixel: (value: Pixel, index: number) => void
}

export const usePaintStore = create<PaintStore>(set => ({
	mode: MODES.NONE,
	setMode: value => set(() => ({ mode: value })),

	color: '#eb4034',
	setColor: value => set(() => ({ color: value })),

	canvas: Array.from({ length: PIXEL_ART_RES ** 2 }, () => ({ color: '#FFF' })),
	setCanvas: value => set(() => ({ canvas: value })),

	setCanvasPixel: (value, index) =>
		set(({ canvas }) => {
			const newCanvas = structuredClone(canvas)
			newCanvas.splice(index, 1, value)
			return { canvas: newCanvas }
		})
}))
