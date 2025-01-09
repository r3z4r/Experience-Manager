import React from 'react'
import { addressFormStyles } from './AddressForm.styles'

interface AddressFormProps {
  streetAddress: string
  country: string
  state: string
  city: string
  zipCode: string
}

export const AddressForm: React.FC<AddressFormProps> = ({
  streetAddress,
  country,
  state,
  city,
  zipCode,
}) => {
  return (
    <>
      <style>{addressFormStyles}</style>
      <div className={'formContainer'}>
        <h3 className={'heading'}>Company Address</h3>

        {/* Street Address */}
        <div className={'inputField'}>
          <label>
            {'Street Address'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter street address'} value={streetAddress} />
        </div>

        {/* Country */}
        <div className={'inputField'}>
          <label>
            {'Country'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter country'} value={country} />
        </div>

        {/* State/Region */}
        <div className={'inputField'}>
          <label>
            {'State/Region'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter state or region'} value={state} />
        </div>

        {/* City */}
        <div className={'inputField'}>
          <label>
            {'City'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter city'} value={city} />
        </div>

        {/* Zip/Postal Code */}
        <div className={'inputField'}>
          <label>
            {'Zip/Postal Code'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter zip or postal code'} value={zipCode} />
        </div>
      </div>
    </>
  )
}
