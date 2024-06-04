import { PLANS_BILLING_CYCLE_ENUM } from './../api/types/pricing_plans_types';

export const PRICING_PLANS_DATA = [
  {
    title: 'Personal',
    subtitle: '',
    price: 0,
    priceDetails: 'Free',
    currency: '$',
    description: 'For individual developers who want essential features to scale personal projects.',
    billingCycle: PLANS_BILLING_CYCLE_ENUM.Forever,
    recommended: false
  },
  {
    title: 'Pro',
    subtitle: 'Subtitle description',
    price: 12.5,
    priceDetails: 'Free',
    currency: '$',
    description: 'For individual developers who want essential features to scale personal projects.',
    billingCycle: PLANS_BILLING_CYCLE_ENUM.Monthly,
    recommended: true
  }
];

export const REVIEWS_DATA = [
  {
    name: 'Vytis',
    age: 31,
    savings: { saved: 0, currency: '€' },
    imageURL: '248946_image.png',
    message: 'Nusipirkau žiedą vienoje.'
  },
  {
    name: 'Martynas',
    age: 25,
    savings: { saved: 1862, currency: '€' },
    imageURL: '274946_image.png',
    message: 'Cool!'
  }
];
