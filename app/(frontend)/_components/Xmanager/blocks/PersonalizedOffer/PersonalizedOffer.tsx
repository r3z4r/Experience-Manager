import { PersonalizedOfferProps } from '../types'
import { personalizedOfferStyles } from './PersonalizedOffer.styles'

export function PersonalizedOffer({
  userName = 'Reza',
  productName = 'Samsung Galaxy S24 Ultra',
  productImage = '/xpm/images/samsungS24ultra.png',
  productPrice = '₹1,39,999',
  originalPrice = '₹1,59,999',
  discountAmount = '₹20,000',
  bonusOffer = 'Enjoy 1-year Samsung Buds 2 + priority delivery to your doorstep.',
  buttonText = 'Buy Now',
}: PersonalizedOfferProps) {
  return (
    <>
      <style>{personalizedOfferStyles}</style>
      <div className={'personalizedOffer'}>
        <h2 className={'greeting'}>Hi {userName},</h2>
        <h3 className={'productTitle'}>
          Unlock Your Dream {productName} – <br />
          Exclusive Discount Just for You!
        </h3>
        <p className={'offerDescription'}>
          Limited-Time Offer: Grab the latest {productName} at an unbeatable price!
        </p>

        <div className={'productImageContainer'}>
          <img
            src={productImage}
            alt={`${productName}`}
            width={200}
            height={200}
            className={'productImage'}
          />
        </div>

        <p className={'productDetails'}>
          Elevate your Tech Game with the All-New {productName}, <br />
          now at a price tailored just for you!
        </p>

        <div className={'pricing'}>
          <p>
            <strong>Discount Just for You:</strong> Save {discountAmount} instantly!
          </p>
          <p>
            <strong>Your Price:</strong> ₹{productPrice}{' '}
            <span className={'originalPrice'}>(MRP: ₹{originalPrice})</span>
          </p>
        </div>

        <p className={'bonusOffer'}>
          <strong>Bonus Gift:</strong> {bonusOffer}
        </p>

        <button className={'buyButton'}>{buttonText}</button>
      </div>
    </>
  )
}
