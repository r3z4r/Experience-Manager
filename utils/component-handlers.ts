interface ComponentHandler {
  render: (config: any) => Promise<{
    html: string
    script?: string
  }>
}

interface ComponentHandlers {
  [key: string]: ComponentHandler
}

export const componentHandlers: ComponentHandlers = {
  'stripe-payment': {
    render: async (config: { priceId: string; mode?: 'payment' | 'subscription' }) => {
      return {
        html: `
          <div class="stripe-payment" data-price-id="${config.priceId}" data-mode="${config.mode || 'payment'}">
            <div id="payment-element"></div>
            <button id="submit-payment" class="payment-button">Pay Now</button>
            <div id="payment-message" class="payment-message"></div>
          </div>
        `,
        script: `
          const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
          
          const paymentElement = document.querySelector('.stripe-payment');
          const priceId = paymentElement.dataset.priceId;
          const mode = paymentElement.dataset.mode;
          
          // Create payment session
          const { clientSecret } = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              priceId,
              mode
            }),
          }).then(r => r.json());
          
          const elements = stripe.elements({
            clientSecret
          });
          
          const payment = elements.create('payment');
          payment.mount('#payment-element');
          
          // Handle form submission
          const form = document.querySelector('#submit-payment');
          form.addEventListener('click', async (e) => {
            e.preventDefault();
            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: window.location.origin + '/payment/success',
              },
            });
            
            if (error) {
              const messageDiv = document.querySelector('#payment-message');
              messageDiv.textContent = error.message;
            }
          });
        `
      }
    }
  },

  'sign-in': {
    render: async (config: { redirectUrl: string }) => {
      return {
        html: `
          <div class="auth-redirect" data-redirect="${config.redirectUrl}">
            <button onclick="handleSignIn()" class="signin-button">
              Sign In
            </button>
          </div>
        `,
        script: `
          function handleSignIn() {
            const redirect = document.querySelector('.auth-redirect').dataset.redirect;
            window.location.href = '/auth/signin?redirect=' + encodeURIComponent(redirect);
          }
        `
      }
    }
  },

  'custom-form': {
    render: async (config: { 
      fields: Array<{
        type: string
        name: string
        label: string
        required?: boolean
      }>,
      submitUrl: string
    }) => {
      const fieldHtml = config.fields.map(field => `
        <div class="form-field">
          <label for="${field.name}">${field.label}</label>
          <input 
            type="${field.type}" 
            name="${field.name}" 
            id="${field.name}"
            ${field.required ? 'required' : ''}
          />
        </div>
      `).join('')

      return {
        html: `
          <form class="custom-form" data-submit-url="${config.submitUrl}">
            ${fieldHtml}
            <button type="submit">Submit</button>
            <div class="form-message"></div>
          </form>
        `,
        script: `
          const form = document.querySelector('.custom-form');
          const submitUrl = form.dataset.submitUrl;
          
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
              const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
              
              const result = await response.json();
              
              const messageDiv = form.querySelector('.form-message');
              if (response.ok) {
                messageDiv.textContent = 'Form submitted successfully!';
                messageDiv.className = 'form-message success';
                form.reset();
              } else {
                messageDiv.textContent = result.error || 'An error occurred';
                messageDiv.className = 'form-message error';
              }
            } catch (error) {
              const messageDiv = form.querySelector('.form-message');
              messageDiv.textContent = 'An error occurred';
              messageDiv.className = 'form-message error';
            }
          });
        `
      }
    }
  }
}
