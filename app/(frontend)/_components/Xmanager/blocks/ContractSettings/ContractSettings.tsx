import React from 'react'
import { contractSettingsStyles } from './ContractSettings.styles'

export const ContractSettings: React.FC = () => {
  return (
    <>
      <style>{contractSettingsStyles}</style>
      <div>
        <h2 className="heading">How long do you want your contract to run?</h2>
        <div className="radioGroup">
          <label>
            <input type="radio" name="contractDuration" /> 36 months
          </label>
          <label>
            <input type="radio" name="contractDuration" /> 24 months
          </label>
          <label>
            <input type="radio" name="contractDuration" /> 12 months
          </label>
        </div>

        <h2 className="heading">Renewal Settings</h2>
        <p>Auto Renew when this contract ends on - Sun Aug 01 2027?</p>
        <div className="radioGroup">
          <label>
            <input type="radio" name="autoRenew" /> Yes
          </label>
          <label>
            <input type="radio" name="autoRenew" /> No
          </label>
        </div>
        <p>
          I understand that when I renew, the seller’s pricing terms and end user license agreement
          (EULA) might have changed. On the renewal date, I will be billed based on the price and
          EULA applicable on that date, which I can find on your Marketplace Software page.
        </p>

        <h2 className="heading">Preferred Currency</h2>
        <p>US Dollar | USD ($)</p>

        <div className="dropdownGroup">
          <div className="inputField">
            <label>
              When do you plan to apply?<span className="required">*</span>
            </label>
            <select>
              <option>Please Select</option>
            </select>
          </div>
          <div className="inputField">
            <label>
              How did you learn about API Certification Programs?<span className="required">*</span>
            </label>
            <select>
              <option>Please Select</option>
            </select>
          </div>
        </div>
      </div>
    </>
  )
}
