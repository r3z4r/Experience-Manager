import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { Features } from './Features'
import { Globe2, Zap, Shield } from 'lucide-react'

const defaultFeaturesData = {
  title: 'Why Choose Our eSIM',
  description: 'Stay connected globally with our reliable and easy-to-use eSIM solutions',
  features: [
    {
      icon: <Globe2 className="w-full h-full" />,
      title: 'Global Coverage',
      description: 'Connect seamlessly in over 190 countries worldwide',
    },
    {
      icon: <Zap className="w-full h-full" />,
      title: 'Instant Activation',
      description: 'Get connected in minutes with our digital eSIM delivery',
    },
    {
      icon: <Shield className="w-full h-full" />,
      title: 'Secure Connection',
      description: 'Enterprise-grade security for your mobile data',
    },
  ],
}

export const featuresBlock: BlockProperties = {
  id: 'features-section',
  label: 'Features Section',
  category: 'Sections',
  content: renderToString(<Features {...defaultFeaturesData} />),
  attributes: {
    class: 'fa fa-th-large',
  },
}
