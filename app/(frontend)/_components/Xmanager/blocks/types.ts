import type { User, Page } from '@/payload-types'
import { BlockProperties } from 'grapesjs'

export interface BaseBlockProps {
  className?: string
}

export interface AuthBlockProps extends BaseBlockProps {
  onSuccess?: (user: User) => void
}

export interface PaymentBlockProps extends BaseBlockProps {
  clientSecret: string
  onSuccess?: () => void
}

export interface TemplateBlockProps extends BaseBlockProps {
  template: Page
}

// Re-export existing block props
export interface HeroProps extends BaseBlockProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export interface ServiceCardProps extends BaseBlockProps {
  title?: string
  description?: string
  imageUrl?: string
}
export interface PersonalizedOfferProps extends BaseBlockProps {
  userName?: string
  productName?: string
  productImage?: string
  productPrice?: string
  originalPrice?: string
  discountAmount?: string
  bonusOffer?: string
  buttonText?: string
}
export interface Spec {
  label?: string
  details?: string | string[]
}

export interface TechnicalSpecsProps extends BaseBlockProps {
  title?: string
  specs?: Spec[]
}
interface AddonCardProps {
  title?: string
  description?: string
  image?: string
  buttonText?: string
}

export interface AddonsCardProps extends BaseBlockProps {
  title?: string
  addons?: AddonCardProps[]
}
export interface ProductCardProps {
  imageSrc?: string
  name?: string
  price?: string
  onClick?: () => void
}

export interface HeadingBannerProps {
  title?: string
  filterLabel?: string
  sortLabel?: string
}
export interface StatisticsProps extends BaseBlockProps {
  items?: Array<{
    percentage: number
    description: string
  }>
}

export interface MomentsHeaderProps extends BaseBlockProps {
  logoSrc?: string
  logoAlt?: string
  navLinks?: Array<{
    href: string
    label: string
  }>
  showLanguageSelector?: boolean
}

export interface SubscriptionProps extends BaseBlockProps {
  title?: string
  price?: string
  period?: string
  packageType?: string
  sessions?: number
  description?: string
  imageUrl?: string
}

export interface CarouselProps extends BaseBlockProps {
  items: Array<{
    imageUrl: string
    title: string
    description: string
  }>
}

export interface FooterProps extends BaseBlockProps {
  logoSrc?: string
  socialLinks?: Array<{ icon: string; href: string }>
  quickLinks?: Array<{ label: string; href: string }>
}

export interface CardProps extends BaseBlockProps {
  title: string
  listItems: string[]
  imageUrl: string
  buttonText: string
  buttonUrl: string
  imagePosition: 'left' | 'right'
}

export interface PaymentBlockProps extends BaseBlockProps {
  clientSecret: string
  onSuccess?: () => void
}
