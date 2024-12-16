import { BlockConfig } from '../types'
import { SignInBlock } from './SignIn'
import { renderToString } from 'react-dom/server'

export const signInBlock: BlockConfig = {
  id: 'sign-in',
  label: 'Sign In Form',
  category: 'Auth',
  content: renderToString(<SignInBlock />),
  attributes: {
    class: 'sign-in-block',
  },
}
