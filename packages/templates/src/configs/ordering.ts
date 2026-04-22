import type { TemplateConfig, ScreenConfig } from '../render';

const sharedData = {
  product: { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '\u20B91,299', description: 'Lightweight, fast-absorbing serum with Vitamin C and Hyaluronic Acid for radiant, hydrated skin.', categories: ['Beauty', 'Skincare'], instagram: '@luminara.beauty' },
  brand: { name: 'Luminara Beauty' },
  wallet: 12400,
  returning: true,
};

const fourStepScreens: ScreenConfig[] = [
  { label: 'Goal & Product', components: [
    { component: 'goal-cards', props: {} },
    { component: 'product-scanner', props: { heading: 'And what product are you promoting?' } },
  ]},
  { label: 'Content & Budget', components: [
    { component: 'content-type', props: {} },
    { component: 'budget-section', props: {} },
    { component: 'wallet-card', props: { campaignTotal: 30000 } },
  ]},
  { label: 'Brief & Scripts', components: [
    { component: 'brief-editor', props: {} },
    { component: 'intelligence', props: {} },
    { component: 'script-preview', props: { showReturning: true } },
  ]},
  { label: 'Checkout', components: [
    { component: 'checkout', props: { total: 30000 } },
  ]},
];

const fiveStepScreens: ScreenConfig[] = [
  { label: 'Goal', components: [
    { component: 'goal-cards', props: {} },
  ]},
  { label: 'Product', components: [
    { component: 'product-scanner', props: {} },
    { component: 'intelligence', props: {} },
  ]},
  { label: 'Content & Budget', components: [
    { component: 'content-type', props: {} },
    { component: 'budget-section', props: {} },
    { component: 'wallet-card', props: { campaignTotal: 30000 } },
  ]},
  { label: 'Brief & Scripts', components: [
    { component: 'brief-editor', props: {} },
    { component: 'script-preview', props: { showReturning: true } },
  ]},
  { label: 'Checkout', components: [
    { component: 'checkout', props: { total: 30000 } },
  ]},
];

const sixStepScreens: ScreenConfig[] = [
  { label: 'Goal', components: [
    { component: 'goal-cards', props: {} },
  ]},
  { label: 'Product', components: [
    { component: 'product-scanner', props: {} },
    { component: 'intelligence', props: {} },
  ]},
  { label: 'Content Type', components: [
    { component: 'content-type', props: {} },
  ]},
  { label: 'Brief & Scripts', components: [
    { component: 'brief-editor', props: {} },
    { component: 'script-preview', props: { showReturning: true } },
  ]},
  { label: 'Budget', components: [
    { component: 'budget-section', props: {} },
    { component: 'wallet-card', props: { campaignTotal: 30000 } },
  ]},
  { label: 'Checkout', components: [
    { component: 'checkout', props: { total: 30000 } },
  ]},
];

export const orderingConfigs: Record<string, TemplateConfig> = {
  '4step-stepper': { layout: 'stepper', product: 'brand', screens: fourStepScreens, data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (4-Step)' } },
  '4step-scroll':  { layout: 'scroll',  product: 'brand', screens: fourStepScreens, data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (4-Step Scroll)' } },
  '5step-stepper': { layout: 'stepper', product: 'brand', screens: fiveStepScreens, data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (5-Step)' } },
  '5step-scroll':  { layout: 'scroll',  product: 'brand', screens: fiveStepScreens, data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (5-Step Scroll)' } },
  '6step-stepper': { layout: 'stepper', product: 'brand', screens: sixStepScreens,  data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (6-Step)' } },
  '6step-scroll':  { layout: 'scroll',  product: 'brand', screens: sixStepScreens,  data: sharedData, meta: { title: 'Amplify \u2014 New Campaign (6-Step Scroll)' } },
};
