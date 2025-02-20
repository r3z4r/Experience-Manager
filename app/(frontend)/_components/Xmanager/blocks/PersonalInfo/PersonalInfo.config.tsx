'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { PersonalInfo } from './PersonalInfo'

export async function getPersonalInformationFormBlock() {
  return await createBlockConfig({
    id: 'personal-info',
    label: 'Personal Information Form',
    category: 'Components',
    component: <PersonalInfo />,
    attributes: {
      class: 'fa fa-user',
    },
  })
}
