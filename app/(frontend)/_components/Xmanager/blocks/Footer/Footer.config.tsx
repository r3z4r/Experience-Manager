'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Footer } from './Footer'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const defaultFooterData = {
  logo: {
    src: '/images/logo.svg',
    alt: 'Brand Logo',
  },
  description: 'Your trusted partner for global connectivity solutions.',
  columns: [
    {
      title: 'Products',
      links: [
        { label: 'eSIM Plans', href: '/plans' },
        { label: 'Global Coverage', href: '/coverage' },
        { label: 'Business Solutions', href: '/business' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  socialLinks: [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
    { icon: <Youtube className="h-5 w-5" />, href: '#', label: 'YouTube' },
  ],
  bottomText: '© 2024 Your Brand. All rights reserved.',
  theme: 'light' as const,
}

export async function getFooterBlock() {
  return await createBlockConfig({
    id: 'footer',
    label: 'Footer Section',
    category: 'Sections',
    component: <Footer {...defaultFooterData} />,
    attributes: {
      class: 'fa fa-bars',
    },
  })
}
