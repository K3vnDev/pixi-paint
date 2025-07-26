import { MODES } from '@/consts'
import { usePaintStore } from '@/store/usePaintStore'

export const ToolBar = () => {
	const setMode = usePaintStore(s => s.setMode)

	const items = [
		{
			name: 'Paint',
			mode: MODES.PAINT
		},
		{
			name: 'Erase',
			mode: MODES.ERASE
		}
	]

	return (
		<aside>
			{items.map(({ name, mode }, i) => (
				<button onClick={() => setMode(mode)} key={i}>
					{name}
				</button>
			))}
		</aside>
	)
}
