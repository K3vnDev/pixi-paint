import { EVENTS } from '@consts'
import type { DialogMenuDetail } from '@types'
import { useState } from 'react'
import { generateId } from '@/utils/generateId'
import { useEvent } from './useEvent'

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

  useEvent(
    '$dialog-menu-closed',
    e => {
      const { detail: closedId } = e as CustomEvent<string>
      if (closedId === openId) setOpenId(null)
    },
    { deps: [openId] }
  )

  return { openMenu, closeMenu, menuIsOpen: !!openId }
}
