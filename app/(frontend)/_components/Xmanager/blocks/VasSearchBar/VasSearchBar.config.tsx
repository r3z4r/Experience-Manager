'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { VasSearchBar } from './VasSearchBar'

export async function getVasSearchBarBlock() {
  return await createBlockConfig({
    id: 'vas-search-bar',
    label: 'VAS Search Bar',
    category: 'Components',
    component: <VasSearchBar />,
    attributes: {
      class: 'fa fa-search',
    },
  })
}
