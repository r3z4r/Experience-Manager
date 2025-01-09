import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { ContractSettings } from './ContractSettings'

export const contractSettingsBlock: BlockProperties = {
  id: 'contractSettings-card',
  label: 'ContractSettings Form',
  category: 'Components',
  content: renderToString(<ContractSettings />),
  attributes: {
    class: 'contractSettings-card',
  },
}
