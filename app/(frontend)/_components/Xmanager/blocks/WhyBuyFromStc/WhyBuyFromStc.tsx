import {} from '../types'
import { whyBuyFromStcStyles } from './WhyBuyFromStc.styles'

export function WhyBuyFromStc() {
  return (
    <>
      <style>{whyBuyFromStcStyles}</style>
      <section className={'whyBuySection'}>
        <div className={'contentContainer'}>
          <h2 className={'sectionTitle'}>Why buy from stc</h2>
          <div className={'detailsContainer'}>
            <div className={'detailsTitle'}>Details</div>
            <div className={'detailItem'}>
              <p className={'detailTitle'}>✓ Easy plan activation</p>
              <p className={'detailDescription'}>
                After you buy a device + plan, we’ll deliver your phone with a SIM card and verify
                your ID with few clicks. That’s it!
              </p>
            </div>
            <div className={'detailItem'}>
              <p className={'detailTitle'}>✓ Free delivery on all orders</p>
              <p className={'detailDescription'}>
                Get it within 24 hrs across the kingdom on orders placed between 10am-7pm. Track
                your order online.
              </p>
            </div>
            <div className={'detailItem'}>
              <p className={'detailTitle'}>✓ Simple contract terms</p>
              <p className={'detailDescription'}>
                We’re transparent about your postpaid plan terms, fees and cancellation in the terms
                and conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
