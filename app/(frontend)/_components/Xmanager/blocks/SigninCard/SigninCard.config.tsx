import { renderToString } from 'react-dom/server'
import { BlockConfig } from '../types'
import { SigninCard } from './SigninCard'

export const signinCardBlock: BlockConfig = {
  id: 'signin-card',
  label: 'Sign-in Card',
  category: 'Components',
  content: renderToString(<SigninCard />),
  attributes: {
    class: 'signin-card',
  },
}
