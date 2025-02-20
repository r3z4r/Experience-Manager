'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Navbar } from './Navbar'

const defaultNavData = {
  logo: {
    src: '/images/logo.svg',
    alt: 'Brand Logo',
  },
  primaryLinks: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  secondaryLinks: [
    { label: 'Sign In', href: '/signin' },
    { label: 'Get Started', href: '/register', isButton: true },
  ],
  showSearch: true,
  showCart: true,
  theme: 'light' as const,
}

export async function getNavbarBlock() {
  return await createBlockConfig({
    id: 'navbar',
    label: 'Navigation Bar',
    category: 'Layout',
    component: <Navbar {...defaultNavData} />,
    attributes: {
      class: 'fa fa-bars',
    },
  })
}
