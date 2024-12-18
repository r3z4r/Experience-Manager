import { BlockProperties } from 'grapesjs'
import { AddonsCard } from './AddonsCard'
import { renderToString } from 'react-dom/server'

export const addonsCardBlock: BlockProperties = {
  id: 'addonsCard',
  label: 'Addonscard Banner',
  category: 'Components',
  content: renderToString(<AddonsCard />),
  attributes: {
    class: 'addonsCard',
  },
}
