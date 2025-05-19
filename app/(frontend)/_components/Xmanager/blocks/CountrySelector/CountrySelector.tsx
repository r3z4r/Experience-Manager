import React from 'react'
import { CountrySelectorStyles } from './CountrySelector.styles'

export function CountrySelector() {
  const selected = 'AE'
  const countries = [
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
  ]

  const countryName = 'United Arab Emirates'
  const benefits = [
    `Plans and pricing specific to ${countryName}`,
    'Local customer support and service',
    'Promotions available in your region',
  ]

  return (
    <>
      <style>{CountrySelectorStyles}</style>
      <div className="countrySelectorWrapper">
        <h4 className="countryTitle">Select Your Country</h4>
        <p className="countrySubtitle">We’ll customize your experience based on your location</p>

        <div className="countryDropdownWrapper">
          <select className="countryDropdown" defaultValue={selected} disabled>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} &nbsp; {c.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="benefitsList">
          {benefits.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <button className="continueButton">
          Continue <span>→</span>
        </button>
      </div>
    </>
  )
}
