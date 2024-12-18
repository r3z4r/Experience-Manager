import { BlockProperties } from 'grapesjs'

export const scriptBlock: BlockProperties = {
  id: 'script',
  label: 'Custom Script',
  category: 'Extra',
  content: {
    type: 'script',
    tagName: 'script',
    layerable: true,
    droppable: false,
    draggable: true,
    selectable: true,
    attributes: {
      type: 'text/javascript',
    },
    components: [
      {
        type: 'textnode',
        content: '// Your JavaScript code here',
      },
    ],
  },
  attributes: {
    class: 'fa fa-code',
  },
}
