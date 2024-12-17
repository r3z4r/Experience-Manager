import { BlockConfig } from '../types'
import { AddonsCard } from './AddonsCard'
import { renderToString } from 'react-dom/server'

export const addonsCardBlock: BlockConfig = {
  id: 'addonsCard',
  label: 'Addonscard Banner',
  category: 'Components',
  content: renderToString(<AddonsCard />),
  attributes: {
    class: 'addonsCard',
  },
}
