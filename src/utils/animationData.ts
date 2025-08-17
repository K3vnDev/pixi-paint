export interface AnimationData {
  value: string
  duration: number
}

export const animationData = {
  menuShowVertical: (duration = 130, easing = 'ease-out'): AnimationData => {
    return { value: `menu-show-vertical ${duration}ms ${easing} both`, duration }
  },
  menuHideVertical: (duration = 70, easing = 'ease-in'): AnimationData => {
    return { value: `menu-hide-vertical ${duration}ms ${easing} both`, duration }
  },

  menuShowHorizontal: (duration = 130, easing = 'ease-out'): AnimationData => {
    return { value: `menu-show-horizontal ${duration}ms ${easing} both`, duration }
  },
  menuHideHorizontal: (duration = 70, easing = 'ease-in'): AnimationData => {
    return { value: `menu-hide-horizontal ${duration}ms ${easing} both`, duration }
  }
}
