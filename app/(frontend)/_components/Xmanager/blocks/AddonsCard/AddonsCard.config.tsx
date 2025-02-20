'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { AddonsCard } from './AddonsCard'

export async function getAddonsCardBlock() {
  return await createBlockConfig({
    id: 'addonsCard',
    label: 'Addonscard Banner',
    category: 'Components',
    component: <AddonsCard />,
    attributes: {
      class: 'addonsCard',
    },
  })
}
