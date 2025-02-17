import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CreditCardForm } from './CreditCardForm'

export const creditCardFormBlock: BlockProperties = {
  id: 'credit-card-form',
  label: 'Credit Card Form',
  category: 'Sections',
  content: renderToString(<CreditCardForm onSubmit={() => {}} />),
  attributes: {
    class: 'fa fa-credit-card',
  },
}
