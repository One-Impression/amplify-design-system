const { register } = require('../../registry.cjs');

register('auth-card', (props, ctx) => {
  const mode = props.mode || 'login';

  const configs = {
    login: {
      heading: 'Welcome back',
      subheading: 'Sign in to your Amplify account',
      fields: [
        { type: 'email', label: 'Email', placeholder: 'you@company.com', id: 'authEmail' },
        { type: 'password', label: 'Password', placeholder: 'Enter your password', id: 'authPassword' }
      ],
      button: 'Sign In',
      footer: '<a href="#" onclick="switchAuthMode(\'forgot\');return false" style="font-size:var(--amp-text-sm);color:var(--amp-accent);text-decoration:none">Forgot password?</a>',
      bottomText: 'Don\'t have an account? <a href="#" onclick="switchAuthMode(\'signup\');return false" style="color:var(--amp-accent);text-decoration:none;font-weight:500">Sign up</a>'
    },
    signup: {
      heading: 'Create your account',
      subheading: 'Start running campaigns in minutes',
      fields: [
        { type: 'text', label: 'Full Name', placeholder: 'Priya Sharma', id: 'authName' },
        { type: 'email', label: 'Work Email', placeholder: 'you@company.com', id: 'authEmail' },
        { type: 'text', label: 'Company Name', placeholder: 'Your brand or agency', id: 'authCompany' },
        { type: 'password', label: 'Password', placeholder: 'Min 8 characters', id: 'authPassword' }
      ],
      button: 'Create Account',
      footer: '',
      bottomText: 'Already have an account? <a href="#" onclick="switchAuthMode(\'login\');return false" style="color:var(--amp-accent);text-decoration:none;font-weight:500">Sign in</a>'
    },
    forgot: {
      heading: 'Reset your password',
      subheading: 'We\'ll send a verification code to your email',
      fields: [
        { type: 'email', label: 'Email', placeholder: 'you@company.com', id: 'authEmail' }
      ],
      button: 'Send Reset Code',
      footer: '',
      bottomText: 'Remember your password? <a href="#" onclick="switchAuthMode(\'login\');return false" style="color:var(--amp-accent);text-decoration:none;font-weight:500">Sign in</a>'
    },
    otp: {
      heading: 'Enter verification code',
      subheading: 'We sent a 6-digit code to your email',
      fields: [
        { type: 'otp', label: 'Verification Code', id: 'authOtp' }
      ],
      button: 'Verify',
      footer: '<a href="#" onclick="resendOtp();return false" style="font-size:var(--amp-text-sm);color:var(--amp-accent);text-decoration:none">Resend code</a>',
      bottomText: '<a href="#" onclick="switchAuthMode(\'login\');return false" style="color:var(--amp-accent);text-decoration:none;font-weight:500">Back to sign in</a>'
    }
  };

  const c = configs[mode] || configs.login;

  const renderField = (field) => {
    if (field.type === 'otp') {
      return `
      <div style="margin-bottom:var(--amp-sp-4)">
        <label style="display:block;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text);margin-bottom:var(--amp-sp-2)">${field.label}</label>
        <div style="display:flex;gap:var(--amp-sp-2);justify-content:center">
          ${[0,1,2,3,4,5].map(i => `<input type="text" maxlength="1" class="otp-input" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:700;border:2px solid var(--amp-border);border-radius:var(--amp-radius-lg);background:var(--amp-surface);color:var(--amp-text);outline:none;transition:border-color .15s" onfocus="this.style.borderColor='var(--amp-accent)'" onblur="this.style.borderColor='var(--amp-border)'" oninput="otpInput(this,${i})" />`).join('')}
        </div>
      </div>`;
    }
    return `
    <div style="margin-bottom:var(--amp-sp-4)">
      <label style="display:block;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text);margin-bottom:var(--amp-sp-2)">${field.label}</label>
      <input type="${field.type}" id="${field.id}" placeholder="${field.placeholder}" style="width:100%;padding:var(--amp-sp-3) var(--amp-sp-4);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);font-size:var(--amp-text-sm);color:var(--amp-text);background:var(--amp-surface);outline:none;transition:border-color .15s;box-sizing:border-box" onfocus="this.style.borderColor='var(--amp-accent)'" onblur="this.style.borderColor='var(--amp-border)'" />
    </div>`;
  };

  return `
<div class="auth-card" style="width:100%;max-width:420px;margin:0 auto">
  <div style="text-align:center;margin-bottom:var(--amp-sp-6)">
    <div style="font-size:28px;font-weight:800;letter-spacing:-.03em;background:linear-gradient(135deg,var(--amp-violet-600),var(--amp-violet-400));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:var(--amp-sp-2)">amplify</div>
  </div>
  <div class="amp-card" style="padding:var(--amp-sp-8);background:var(--amp-surface);border-radius:var(--amp-radius-xl);box-shadow:0 4px 24px rgba(0,0,0,.06)">
    <div style="text-align:center;margin-bottom:var(--amp-sp-6)">
      <h1 style="font-size:22px;font-weight:700;color:var(--amp-text);margin:0 0 var(--amp-sp-1)">${c.heading}</h1>
      <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:0">${c.subheading}</p>
    </div>
    <form onsubmit="handleAuthSubmit(event,'${mode}')">
      ${c.fields.map(renderField).join('')}
      ${c.footer ? '<div style="text-align:right;margin-bottom:var(--amp-sp-4)">' + c.footer + '</div>' : ''}
      <button type="submit" class="amp-btn amp-btn-primary amp-btn-lg" style="width:100%;padding:var(--amp-sp-3);font-size:var(--amp-text-md);font-weight:600;border-radius:var(--amp-radius-lg);margin-bottom:var(--amp-sp-4)">${c.button}</button>
    </form>
    ${mode === 'login' || mode === 'signup' ? `
    <div style="position:relative;text-align:center;margin-bottom:var(--amp-sp-4)">
      <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:var(--amp-border)"></div>
      <span style="position:relative;background:var(--amp-surface);padding:0 var(--amp-sp-3);font-size:var(--amp-text-xs);color:var(--amp-text-muted)">or continue with</span>
    </div>
    <div style="display:flex;gap:var(--amp-sp-3)">
      <button onclick="socialAuth('google')" style="flex:1;padding:var(--amp-sp-3);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);background:var(--amp-surface);cursor:pointer;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text);transition:background .15s" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='var(--amp-surface)'">Google</button>
      <button onclick="socialAuth('microsoft')" style="flex:1;padding:var(--amp-sp-3);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);background:var(--amp-surface);cursor:pointer;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text);transition:background .15s" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='var(--amp-surface)'">Microsoft</button>
    </div>` : ''}
  </div>
  <div style="text-align:center;margin-top:var(--amp-sp-4);font-size:var(--amp-text-sm);color:var(--amp-text-muted)">${c.bottomText}</div>
</div>`;
});
