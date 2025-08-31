import { EVENTS } from '@consts'
import type { DialogMenuDetail } from '@types'
import { useEffect, useState } from 'react'
import { generateId } from '@/utils/generateId'

export const useDialogMenu = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const openMenu = (component: React.ReactNode) => {
    const id = generateId()
    setOpenId(id)

    const detail: DialogMenuDetail = { component, id }
    const event = new CustomEvent(EVENTS.OPEN_DIALOG_MENU, { detail })
    document.dispatchEvent(event)
  }

  const closeMenu = () => {
    document.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG_MENU))
  }

  useEffect(() => {
    const handleDialogMenuClosed = (e: Event) => {
      const { detail: closedId } = e as CustomEvent<string>
      if (closedId === openId) setOpenId(null)
    }
    document.addEventListener(EVENTS.DIALOG_MENU_CLOSED, handleDialogMenuClosed)
    return () => document.removeEventListener(EVENTS.DIALOG_MENU_CLOSED, handleDialogMenuClosed)
  }, [openId])

  return { openMenu, closeMenu, menuIsOpen: !!openId }
}
