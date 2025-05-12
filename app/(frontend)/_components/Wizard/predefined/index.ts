import React from 'react';
import { LoginStep } from './LoginStep';

export interface PredefinedStep {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  previewImageUrl?: string;
  tags?: string[];
}

export const PREDEFINED_STEPS: PredefinedStep[] = [
  {
    id: 'login',
    name: 'Login',
    description: 'A standard login form with username and password fields',
    component: LoginStep,
    previewImageUrl: '/predefined/login-preview.png',
    tags: ['authentication', 'user', 'form']
  },
  {
    id: 'registration',
    name: 'Registration',
    description: 'User registration form with validation',
    component: LoginStep, // Reusing LoginStep component for now
    previewImageUrl: '/predefined/registration-preview.png',
    tags: ['authentication', 'user', 'form', 'signup']
  },
  {
    id: 'profile',
    name: 'User Profile',
    description: 'User profile information display and editing',
    component: LoginStep, // Reusing LoginStep component for now
    previewImageUrl: '/predefined/profile-preview.png',
    tags: ['user', 'profile', 'account']
  },
  {
    id: 'payment',
    name: 'Payment Form',
    description: 'Secure payment form with credit card validation',
    component: LoginStep, // Reusing LoginStep component for now
    previewImageUrl: '/predefined/payment-preview.png',
    tags: ['payment', 'checkout', 'billing']
  },
  {
    id: 'confirmation',
    name: 'Confirmation',
    description: 'Confirmation page with summary information',
    component: LoginStep, // Reusing LoginStep component for now
    previewImageUrl: '/predefined/confirmation-preview.png',
    tags: ['confirmation', 'summary', 'success']
  },
  {
    id: 'product-selection',
    name: 'Product Selection',
    description: 'Product selection with filtering and search options',
    component: LoginStep, // Reusing LoginStep component for now
    previewImageUrl: '/predefined/product-selection-preview.png',
    tags: ['products', 'selection', 'catalog']
  }
];

export const getPredefinedStepById = (id: string): PredefinedStep | undefined => {
  return PREDEFINED_STEPS.find(step => step.id === id);
};

export const renderPredefinedStep = (id: string, props: any = {}): React.ReactNode => {
  const step = getPredefinedStepById(id);
  if (!step) return null;
  
  const Component = step.component;
  return React.createElement(Component, props);
};
