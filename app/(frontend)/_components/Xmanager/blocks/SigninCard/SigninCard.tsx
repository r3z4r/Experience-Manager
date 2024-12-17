import { signinCardStyles } from './SigninCard.styles'

export function SigninCard() {
  let email = ''
  let password = ''

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, field: string) {
    if (field === 'email') {
      email = event.target.value
    } else if (field === 'password') {
      password = event.target.value
    }
    const button = document.querySelector('.signin-btn') as HTMLButtonElement | null
    if (email.trim() !== '' && password.trim() !== '') {
      button?.classList.add('enabled')
      if (button) {
        button.disabled = false
      }
    } else {
      button?.classList.remove('enabled')
      if (button) {
        button.disabled = false
      }
    }
  }
  return (
    <>
      <style>{signinCardStyles}</style>
      <div className="signin-card">
        <h2>Log in to your account</h2>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => handleInputChange(e, 'email')}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => handleInputChange(e, 'password')}
          />
        </div>
        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        <button className="signin-btn" disabled>
          LOGIN
        </button>
        <div className="signup-link">
          Don’t have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </>
  )
}
