'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { SigninCard } from './SigninCard'

export async function getSigninCardBlock() {
  return await createBlockConfig({
    id: 'signin-card',
    label: 'Signin Card',
    category: 'Components',
    component: <SigninCard />,
    attributes: {
      class: 'fa fa-sign-in',
    },
  })
}
