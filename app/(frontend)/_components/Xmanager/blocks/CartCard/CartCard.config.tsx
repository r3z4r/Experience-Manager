import { BlockProperties } from 'grapesjs'

import { renderToString } from 'react-dom/server'
import { CartCard } from './CartCard'


const defaultCartCard = {
  title: 'HP ProLiant DL380 Gen10 Server',
  description:
    'The HP ProLiant DL380 Gen10 Server is engineered for performance, versatility, and security, offering unparalleled value for businesses. This server is designed to handle complex, resource-intensive tasks while ensuring data integrity and compliance. It’s an ideal choice for enterprises looking to support a variety of applications and workloads in a smart office setup.',
  imageUrl: '/xpm/placeholder.jpg',
  featureList: [
    'Supports up to 3 TB of DDR4 memory for handling large-scale data processing tasks.',
    'Scalability options with support for additional storage and expansion via PCIe slots.',
    "Integrated with HPE's iLO management system for enhanced server monitoring and management.",
  ],
  highlightsList: [
    'Powered by Intel Xeon Scalable Processors, delivering up to 28 cores per processor.',
    'Built-in security features, including Silicon Root of Trust, ensuring protection against firmware',
    'Flexible network connectivity with dual 1GbE and dual 10GbE ports.',
  ],
  buttonText: "Get A Quote",
  buttonUrl: '#',

}

export const cartCardBlock: BlockProperties = {
  id: 'cartCard',
  label: 'Cart Card',
  category: 'Components',
  content: renderToString(<CartCard {...defaultCartCard} />),
  attributes: {
    class: 'cartCard',
  },
}
