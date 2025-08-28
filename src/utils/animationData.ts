export interface AnimationData {
  value: string
  duration: number
}

export const animationData = {
  menuShowVertical: (duration = SHOW_DURATION, easing = EASE_OUT): AnimationData => {
    return { value: `menu-show-vertical ${duration}ms ${easing} both`, duration }
  },
  menuHideVertical: (duration = HIDE_DURATION, easing = EASE_IN): AnimationData => {
    return { value: `menu-hide-vertical ${duration}ms ${easing} both`, duration }
  },

  menuShowHorizontal: (duration = SHOW_DURATION, easing = EASE_OUT): AnimationData => {
    return { value: `menu-show-horizontal ${duration}ms ${easing} both`, duration }
  },
  menuHideHorizontal: (duration = HIDE_DURATION, easing = EASE_IN): AnimationData => {
    return { value: `menu-hide-horizontal ${duration}ms ${easing} both`, duration }
  }
}

const SHOW_DURATION = 125
const HIDE_DURATION = 66

const EASE_IN = 'ease-in'
const EASE_OUT = 'ease-out'
