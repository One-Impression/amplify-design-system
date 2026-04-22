const { render, renderAll } = require('../registry.cjs');

function getCSS() {
  return `
/* Auth Layout */
.auth-wrapper{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--amp-violet-50) 0%,var(--amp-stone-50) 40%,var(--amp-violet-50) 100%);position:relative;overflow:hidden;padding:var(--amp-sp-6)}
.auth-wrapper::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.06) 0%,transparent 70%);top:-200px;right:-200px}
.auth-wrapper::after{content:'';position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.04) 0%,transparent 70%);bottom:-100px;left:-100px}
.auth-inner{position:relative;z-index:1;width:100%;max-width:480px}
.auth-card{animation:fadeSlideIn .4s ease-out}
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.otp-input:focus{border-color:var(--amp-accent) !important;box-shadow:0 0 0 3px rgba(124,58,237,.1)}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;

  // Collect all components from all screens
  const allComponents = [];
  (screens || []).forEach(s => {
    (s.components || []).forEach(c => allComponents.push(c));
  });

  let html = `
<div class="auth-wrapper">
  <div class="auth-inner">
    ${renderAll(allComponents, context)}
  </div>
</div>`;

  // JavaScript
  html += `<script>
function handleAuthSubmit(e, mode) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = 'Loading...';
  btn.style.opacity = '0.7';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.opacity = '1';
    btn.disabled = false;
    if (mode === 'login') {
      alert('Login successful! Redirecting to dashboard...');
    } else if (mode === 'signup') {
      switchAuthMode('otp');
    } else if (mode === 'forgot') {
      switchAuthMode('otp');
    } else if (mode === 'otp') {
      alert('Verified! Redirecting...');
    }
  }, 1500);
}

function switchAuthMode(mode) {
  /* In a real app, this would re-render. For demo, show alert */
  alert('Switching to: ' + mode + ' mode');
}

function otpInput(el, idx) {
  if (el.value.length === 1) {
    const inputs = document.querySelectorAll('.otp-input');
    if (idx < inputs.length - 1) inputs[idx + 1].focus();
  }
}

function resendOtp() {
  alert('Verification code resent!');
}

function socialAuth(provider) {
  alert('Redirecting to ' + provider + ' OAuth...');
}

/* Simple form validation */
document.querySelectorAll('input[type="email"]').forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value && !this.value.includes('@')) {
      this.style.borderColor = 'var(--amp-red-600)';
    } else {
      this.style.borderColor = 'var(--amp-border)';
    }
  });
});

document.querySelectorAll('input[type="password"]').forEach(input => {
  input.addEventListener('input', function() {
    if (this.value.length > 0 && this.value.length < 8) {
      this.style.borderColor = 'var(--amp-amber-600)';
    } else if (this.value.length >= 8) {
      this.style.borderColor = 'var(--amp-green-600)';
    }
  });
});
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
