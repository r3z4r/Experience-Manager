'use server'

import { BlockProperties } from 'grapesjs'
import { getHeroBlock } from './Hero/Hero.config'
import { getServiceCardBlock } from './ServiceCard/ServiceCard.config'
import { getSigninCardBlock } from './SigninCard/SigninCard.config'
import { getCarouselBlock } from './Carousel/Carousel.config'
import { getFooterBlock } from './Footer/Footer.config'
import { getPersonalizedOfferBlock } from './PersonalizedOffer/PersonalizedOffer.config'
import { getTechnicalSpecsCardBlock } from './TechnicalSpecsCard/TechnicalSpecsCard.config'
import { getAddonsCardBlock } from './AddonsCard/AddonsCard.config'
import { getSubscriptionBlock } from './Subscription/Subscription.config'
import { getCardBlock, getCardRightBlock } from './Card/Card.config'
import { getDeliveryDetailsCardBlock } from './DeliveryDetails/DeliveryDetails.config'
import { scriptBlock } from './Script/Script.config'
import { getAddressFormBlock } from './AddressForm/AddressForm.config'
import { getPersonalInformationFormBlock } from './PersonalInfo/PersonalInfo.config'
import { getFeaturesBlock } from './Features/Features.config'
import { getPlanCardBlock } from './PlanCard/PlanCard.config'
import { getCtaBlock } from './CTA/CTA.config'
import { getNavbarBlock } from './Navbar/Navbar.config'
import { getCheckoutStepsBlock } from './CheckoutSteps/CheckoutSteps.config'
import { getCreditCardFormBlock } from './CreditCardForm/CreditCardForm.config'
import { getEsimOfferBlock } from './ESIMOffer/ESIMOffer.config'
import { getApplicationConfirmationBlock } from './ApplicationConfirmation/ApplicationConfirmation.config'
import { getPaymentBlock } from './Payment/Payment.config'
import { getFootballFeaturesBlock } from './FootballFeatures/FootballFeatures.config'
import { getMerchandiseCardBlock } from './MerchandiseCard/MerchandiseCard.config'
import { getVasSearchBarBlock } from './VasSearchBar/VasSearchBar.config'
import { getVASCardBlock } from './VasCard/VasCard.config'
import { getVASDetailsCardBlock } from './VASDetailsCard/VASDetailsCard.config'
import { getOrderSuccessModalBlock } from './OrderSuccessModal/OrderSuccessModal.config'
import { getCountrySelectorBlock } from './CountrySelector/CountrySelector.config'
import { getUaeLandingScreenBlock } from './LandingPage/LandingPage.config'

export async function getCustomBlocks(): Promise<BlockProperties[]> {
  const blocks = await Promise.all([
    getHeroBlock(),
    getAddressFormBlock(),
    getPersonalInformationFormBlock(),
    getServiceCardBlock(),
    getSigninCardBlock(),
    getCarouselBlock(),
    getFooterBlock(),
    getPersonalizedOfferBlock(),
    getTechnicalSpecsCardBlock(),
    getAddonsCardBlock(),
    getSubscriptionBlock(),
    getCardBlock(),
    getCardRightBlock(),
    getDeliveryDetailsCardBlock(),
    scriptBlock,
    getFeaturesBlock(),
    getPlanCardBlock(),
    getCtaBlock(),
    getNavbarBlock(),
    getCheckoutStepsBlock(),
    getCreditCardFormBlock(),
    getEsimOfferBlock(),
    getApplicationConfirmationBlock(),
    getPaymentBlock(),
    getFootballFeaturesBlock(),
    getMerchandiseCardBlock(),
    getVasSearchBarBlock(),
    getVASCardBlock(),
    getVASDetailsCardBlock(),
    getOrderSuccessModalBlock(),
    getCountrySelectorBlock(),
    getUaeLandingScreenBlock(),
  ])

  return blocks
}
