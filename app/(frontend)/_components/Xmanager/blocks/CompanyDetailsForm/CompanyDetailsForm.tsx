import React from 'react'
import { companyDetailsFormStyles } from './CompanyDetailsForm.styles'

interface CompanyDetailsFormProps {
  companyName: string
  websiteURL: string
  numberOfEmployees: string
}

export const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  companyName,
  websiteURL,
  numberOfEmployees,
}) => {
  return (
    <>
      <style>{companyDetailsFormStyles}</style>
      <div className={'companyDetailsForm'}>
        <div className={'inputField'}>
          <label>
            {'Company Name'} <span className={'required'}>*</span>
          </label>
          <input
            type="text"
            placeholder={'Enter Company Name'}
            value={companyName}
            required={true}
          />
        </div>
        <div className={'inputField'}>
          <label>
            {'Website URL'} <span className={'required'}>*</span>
          </label>
          <input type="text" placeholder={'Enter Website URL'} value={websiteURL} required={true} />
        </div>
        <div className={'inputField'}>
          <label>
            {'Number of Employees'} <span className={'required'}>*</span>
          </label>
          <input
            type="text"
            placeholder={'Enter Number of Employees'}
            value={numberOfEmployees}
            required={true}
          />
        </div>
      </div>
    </>
  )
}
