import { EVENTS } from '@consts'

export const useDialogMenu = () => {
  const openMenu = (data: React.ReactNode) => {
    const event = new CustomEvent(EVENTS.OPEN_DIALOG_MENU, { detail: data })
    document.dispatchEvent(event)
  }
  return { openMenu }
}
