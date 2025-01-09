import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { Breadcrumb } from './BreadCrumb'

const defaultData = {
  items: [
    { label: 'HOME', url: '' },
    { label: 'Moments', url: '' },
    { label: 'Smart Office', url: '' },
    { label: 'Request for Quotation' },
  ],
}

export const breadcrumbBlock: BlockProperties = {
  id: 'breadCrumb-card',
  label: 'BreadCrumb Card',
  category: 'Components',
  content: renderToString(<Breadcrumb {...defaultData} />),
  attributes: {
    class: 'breadCrumb-card',
  },
}
