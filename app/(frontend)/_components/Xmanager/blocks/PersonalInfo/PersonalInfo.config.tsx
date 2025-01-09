import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { PersonalInformationForm } from './PersonalInfo'

export const personalInformationFormBlock: BlockProperties = {
  id: 'personalInformationForm',
  label: 'PersonalInformationForm Card',
  category: 'Components',
  content: renderToString(<PersonalInformationForm />),
  attributes: {
    class: 'personalInformationForm',
  },
}
