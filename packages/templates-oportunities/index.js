/**
 * @amplify-ai/templates-oportunities
 * Asset path exports — resolve from package root.
 *
 * Marketing templates are full standalone HTML pages with the locked
 * Oportunities brand applied. Email templates use table-based layouts
 * and inline CSS only (no external CSS/JS) for email-client safety.
 */

export const marketing = {
  landing: 'marketing/landing.html',
  pricing: 'marketing/pricing.html',
  about: 'marketing/about.html',
  login: 'marketing/login.html',
  signup: 'marketing/signup.html',
  onboarding1: 'marketing/onboarding-1.html',
  onboarding2: 'marketing/onboarding-2.html',
  onboarding3: 'marketing/onboarding-3.html',
};

export const email = {
  welcome: 'email/transactional/welcome.html',
  passwordReset: 'email/transactional/password-reset.html',
  signalLanded: 'email/transactional/signal-landed.html',
  weeklyDigest: 'email/transactional/weekly-digest.html',
  paymentReceipt: 'email/transactional/payment-receipt.html',
  launchAnnouncement: 'email/marketing/launch-announcement.html',
  featureAnnouncement: 'email/marketing/feature-announcement.html',
  caseStudy: 'email/marketing/case-study.html',
};

export const brandColors = {
  apricot: '#E89252',
  apricotBright: '#F0A668',
  terracotta: '#D87B6E',
  purple: '#6B4FA0',
  aiPurple: '#7B5BFF',
  cream: '#FDF8F3',
  creamLight: '#F4ECE0',
  ink: '#0F0D0B',
};

export default {
  marketing,
  email,
  brandColors,
};
