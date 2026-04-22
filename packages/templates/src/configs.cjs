// JSON configs for all 6 ordering flow variants
// Each config defines: screens, components per screen, layout, data

const sharedData = {
  product: { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '₹1,299', description: 'Lightweight, fast-absorbing serum with Vitamin C and Hyaluronic Acid for radiant, hydrated skin.', categories: ['Beauty', 'Skincare'], instagram: '@luminara.beauty' },
  brand: { name: 'Luminara Beauty' },
  wallet: 12400,
  returning: true
};

// 4-Step configs
const fourStep = {
  screens: [
    { label: 'Goal & Product', components: [
      { component: 'goal-cards', props: {} },
      { component: 'product-scanner', props: { heading: 'And what product are you promoting?' } }
    ]},
    { label: 'Content & Budget', components: [
      { component: 'content-type', props: {} },
      { component: 'budget-section', props: {} },
      { component: 'wallet-card', props: { campaignTotal: 30000 } }
    ]},
    { label: 'Brief & Scripts', components: [
      { component: 'brief-editor', props: {} },
      { component: 'intelligence', props: {} },
      { component: 'script-preview', props: { showReturning: true } }
    ]},
    { label: 'Checkout', components: [
      { component: 'checkout', props: { total: 30000 } }
    ]}
  ]
};

// 5-Step configs
const fiveStep = {
  screens: [
    { label: 'Goal', components: [
      { component: 'goal-cards', props: {} }
    ]},
    { label: 'Product', components: [
      { component: 'product-scanner', props: {} },
      { component: 'intelligence', props: {} }
    ]},
    { label: 'Content & Budget', components: [
      { component: 'content-type', props: {} },
      { component: 'budget-section', props: {} },
      { component: 'wallet-card', props: { campaignTotal: 30000 } }
    ]},
    { label: 'Brief & Scripts', components: [
      { component: 'brief-editor', props: {} },
      { component: 'script-preview', props: { showReturning: true } }
    ]},
    { label: 'Checkout', components: [
      { component: 'checkout', props: { total: 30000 } }
    ]}
  ]
};

// 6-Step configs
const sixStep = {
  screens: [
    { label: 'Goal', components: [
      { component: 'goal-cards', props: {} }
    ]},
    { label: 'Product', components: [
      { component: 'product-scanner', props: {} },
      { component: 'intelligence', props: {} }
    ]},
    { label: 'Content Type', components: [
      { component: 'content-type', props: {} }
    ]},
    { label: 'Brief & Scripts', components: [
      { component: 'brief-editor', props: {} },
      { component: 'script-preview', props: { showReturning: true } }
    ]},
    { label: 'Budget', components: [
      { component: 'budget-section', props: {} },
      { component: 'wallet-card', props: { campaignTotal: 30000 } }
    ]},
    { label: 'Checkout', components: [
      { component: 'checkout', props: { total: 30000 } }
    ]}
  ]
};

// Dashboard overview config
const dashboardOverview = {
  screens: [
    { label: 'Dashboard', components: [
      { component: 'filter-bar', props: {} },
      { component: 'metric-cards', props: {} },
      { component: 'chart-placeholder', props: { title: 'Campaign Performance' } },
      { component: 'data-summary-table', props: {} }
    ]}
  ]
};

// Data table config
const dataTableCampaigns = {
  screens: [
    { label: 'Campaigns', components: [
      { component: 'search-filter-bar', props: {} },
      { component: 'bulk-actions', props: {} },
      { component: 'sortable-table', props: {} },
      { component: 'pagination', props: {} }
    ]}
  ]
};

// Entity detail config
const entityDetailCampaign = {
  screens: [
    { label: 'Main', components: [
      { component: 'entity-header', props: {} },
      { component: 'tab-navigation', props: {} },
      { component: 'detail-sections', props: {} }
    ]},
    { label: 'Sidebar', components: [
      { component: 'activity-timeline', props: {} }
    ]}
  ]
};

// Auth login config
const authLogin = {
  screens: [
    { label: 'Auth', components: [
      { component: 'auth-card', props: { mode: 'login' } }
    ]}
  ]
};

module.exports = {
  '4step-stepper': { ...fourStep, layout: 'stepper', product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (4-Step)' } },
  '4step-scroll':  { ...fourStep, layout: 'scroll',  product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (4-Step Scroll)' } },
  '5step-stepper': { ...fiveStep, layout: 'stepper', product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (5-Step)' } },
  '5step-scroll':  { ...fiveStep, layout: 'scroll',  product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (5-Step Scroll)' } },
  '6step-stepper': { ...sixStep, layout: 'stepper', product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (6-Step)' } },
  '6step-scroll':  { ...sixStep, layout: 'scroll',  product: 'brand', data: sharedData, meta: { title: 'Amplify — New Campaign (6-Step Scroll)' } },
  'dashboard-overview': { ...dashboardOverview, layout: 'dashboard', product: 'brand', data: sharedData, meta: { title: 'Amplify — Dashboard', pageTitle: 'Dashboard', pageSubtitle: 'Overview of your campaigns and performance' } },
  'data-table-campaigns': { ...dataTableCampaigns, layout: 'dashboard', product: 'brand', data: sharedData, meta: { title: 'Amplify — Campaigns', pageTitle: 'Campaigns', pageSubtitle: 'Manage all your campaigns in one place' } },
  'entity-detail-campaign': { ...entityDetailCampaign, layout: 'detail', product: 'brand', data: sharedData, meta: { title: 'Amplify — Campaign Detail', entityName: 'Glow Serum Launch', backLabel: 'Campaigns' } },
  'auth-login': { ...authLogin, layout: 'auth', product: 'brand', data: {}, meta: { title: 'Amplify — Sign In' } },
};
