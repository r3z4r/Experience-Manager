import { BlockProperties } from 'grapesjs'
import { SigninCard } from './SigninCard'
import { renderToString } from 'react-dom/server'

export const signinCardBlock: BlockProperties = {
  id: 'signin-card',
  label: 'Sign In Card',
  category: 'Auth',
  content: renderToString(<SigninCard />),
  attributes: {
    class: 'fa fa-sign-in',
  },
}
