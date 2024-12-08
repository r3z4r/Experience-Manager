export interface BlockConfig {
  id: string
  label: string
  category: string
  content: string
  css?: string
  attributes?: Record<string, string>
  media?: string
}

export interface CustomBlockProps {
  className?: string
  children?: React.ReactNode
}

export interface HeroProps extends CustomBlockProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export interface ServiceCardProps extends CustomBlockProps {
  title?: string
  description?: string
  imageUrl?: string
}

export interface MomentsHeaderProps extends CustomBlockProps {
  logoSrc?: string
  logoAlt?: string
  navLinks?: Array<{ href: string; label: string }>
  showLanguageSelector?: boolean
}

export interface SubscriptionProps extends CustomBlockProps {
  title?: string
  price?: string
  period?: string
  packageType?: string
  sessions?: number
  description?: string
  imageUrl?: string
}

export interface CarouselProps extends CustomBlockProps {
  items: Array<{
    imageUrl: string
    title: string
    description: string
  }>
}

export interface FooterProps extends CustomBlockProps {
  logoSrc?: string
  socialLinks?: Array<{ icon: string; href: string }>
  quickLinks?: Array<{ label: string; href: string }>
}

export interface StatisticsProps extends CustomBlockProps {
  items?: Array<{
    percentage: number
    description: string
  }>
}

export interface CardProps extends CustomBlockProps {
  title: string
  listItems: string[]
  imageUrl: string
  buttonText: string
  buttonUrl: string
  imagePosition: 'left' | 'right'
}
