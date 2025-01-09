import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CompanyDetailsForm } from './CompanyDetailsForm'

const defaultData = {
  companyName: '',
  websiteURL: '',
  numberOfEmployees: '',
}

export const companyDetailsBlock: BlockProperties = {
  id: 'companyDetails-card',
  label: 'CompanyDetails Form',
  category: 'Components',
  content: renderToString(<CompanyDetailsForm {...defaultData} />),
  attributes: {
    class: 'companyDetails-card',
  },
}
