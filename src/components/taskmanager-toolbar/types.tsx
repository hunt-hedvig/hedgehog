import { IOption } from '../../features/taskmanager/types'
import { EOrder } from '../tickets/types'

export interface IToolbar {
  items: IToolbarItem[]
}

export interface IToolbarItem {
  id: string
  itemType: string
  label: string
  primary?: boolean
  active: boolean
  caret?: {
    direction: EOrder
  }
  behaviors: {
    onClicked: (id: string) => void
    handleChange?: (id: string, value: any) => void
  }
  options?: IOption[]
}
