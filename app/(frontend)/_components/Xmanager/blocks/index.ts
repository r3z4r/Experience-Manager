import { BlockConfig } from './types'
import { headerBlock } from './Header/Header.config'
import { heroBlock } from './Hero/Hero.config'
import { serviceCardBlock } from './ServiceCard/ServiceCard.config'
import { signinCardBlock } from './SigninCard/SigninCard.config'
import { momentsHeaderBlock } from './MomentsHeader/MomentsHeader.config'
import { carouselBlock } from './Carousel/Carousel.config'
import { footerBlock } from './Footer/Footer.config'
import { footerBannerBlock } from './FooterBanner/FooterBanner.config'
import { dynamicHeaderBlock } from './DynamicHeader/DynamicHeader.config'
import { subscriptionBlock } from './Subscription/Subscription.config'
import { statisticsBlock } from './Statistics/Statistics.config'
import { cardBlock, cardRightBlock } from './Card/Card.config'

export const customBlocks: BlockConfig[] = [
  headerBlock,
  heroBlock,
  serviceCardBlock,
  signinCardBlock,
  momentsHeaderBlock,
  carouselBlock,
  footerBlock,
  footerBannerBlock,
  dynamicHeaderBlock,
  subscriptionBlock,
  statisticsBlock,
  cardBlock,
  cardRightBlock,
]
