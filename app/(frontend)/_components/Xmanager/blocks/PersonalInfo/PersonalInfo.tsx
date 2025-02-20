import React from 'react'
import { personalInfoStyles } from './PersonalInfo.styles'

export const PersonalInfo: React.FC = () => {
  return (
    <>
      <style>{personalInfoStyles}</style>
      <div className="formContainer">
        <h2 className="heading">Personal Information</h2>
        <div className="formRow">
          <div className="inputField">
            <label>
              First Name<span className="required">*</span>
            </label>
            <input type="text" />
          </div>
          <div className="inputField">
            <label>
              Last Name<span className="required">*</span>
            </label>
            <input type="text" />
          </div>
        </div>
        <div className="formRow">
          <div className="inputField">
            <label>
              Job Title<span className="required">*</span>
            </label>
            <input type="text" />
          </div>
          <div className="inputField">
            <label>
              Email<span className="required">*</span>
            </label>
            <input type="email" />
          </div>
        </div>
        <div className="formRow">
          <div className="inputField">
            <label>
              Phone Number<span className="required">*</span>
            </label>
            <input type="text" placeholder="India" />
            <input type="text" placeholder="+91" />
          </div>
        </div>
      </div>
    </>
  )
}
