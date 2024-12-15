import { BlockConfig } from './types'
import { headerBlock } from './Header/Header.config'
import { heroBlock } from './Hero/Hero.config'
import { serviceCardBlock } from './ServiceCard/ServiceCard.config'
import { momentsHeaderBlock } from './MomentsHeader/MomentsHeader.config'
import { carouselBlock } from './Carousel/Carousel.config'
import { footerBlock } from './Footer/Footer.config'
import { subscriptionBlock } from './Subscription/Subscription.config'
import { statisticsBlock } from './Statistics/Statistics.config'
import { cardBlock, cardRightBlock } from './Card/Card.config'
import { paymentBlock } from './Payment/Payment.config'
import { signInBlock } from './SignIn/SignIn.config'

export const customBlocks: BlockConfig[] = [
  headerBlock,
  heroBlock,
  serviceCardBlock,
  momentsHeaderBlock,
  carouselBlock,
  footerBlock,
  subscriptionBlock,
  statisticsBlock,
  cardBlock,
  cardRightBlock,
  paymentBlock,
  signInBlock,
]
