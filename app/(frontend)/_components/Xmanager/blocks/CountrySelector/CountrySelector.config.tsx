
import { createBlockConfig } from '../../utils/serverUtils'
import { CountrySelector } from './CountrySelector'

export async function getCountrySelectorBlock() {
  return await createBlockConfig({
    id: 'country-selector',
    label: 'Country Selector',
    category: 'Components',
    component: <CountrySelector />,
    attributes: {
      class: 'fa fa-globe',
    },
  })
}
