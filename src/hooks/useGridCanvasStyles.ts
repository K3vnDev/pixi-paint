interface Params {
  isVisible?: boolean
  isPressed?: boolean
  isDisabled?: boolean
}

export const useGridCanvasStyles = ({ isVisible = true, isPressed = false, isDisabled = false }: Params) => {
  const canvasState = (() => {
    const visibilityStyle = !isVisible ? 'brightness-150 blur-[4px] scale-75 opacity-0' : ''
    const pressedStyle = isPressed ? 'brightness-90 scale-97' : 'hover:brightness-115'
    const disabledStyle = isDisabled && isVisible ? 'pointer-events-none opacity-7.5' : ''

    return [visibilityStyle, pressedStyle, disabledStyle].join(' ')
  })()

  const canvasItem = 'bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card'

  return { classNameStyles: { canvasState, canvasItem } }
}
