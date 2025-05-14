// Types for Wizard Engine and Steps
import { User, Page } from '@/payload-types';

/**
 * Localization configuration options for the wizard
 */
export interface LocalizationConfig {
  // Available languages for the wizard
  languages?: {
    code: string;      // ISO language code (e.g., 'en', 'fr', 'es')
    name: string;      // Display name (e.g., 'English', 'Français', 'Español')
    default?: boolean; // Whether this is the default language
  }[];
  
  // Available currencies for the wizard
  currencies?: {
    code: string;      // ISO currency code (e.g., 'USD', 'EUR', 'GBP')
    symbol: string;    // Currency symbol (e.g., '$', '€', '£')
    name: string;      // Display name (e.g., 'US Dollar', 'Euro', 'British Pound')
    default?: boolean; // Whether this is the default currency
  }[];
  
  // Whether to show language selector in the wizard
  showLanguageSelector?: boolean;
  
  // Whether to show currency selector in the wizard
  showCurrencySelector?: boolean;
};

export enum WizardStepType {
  Predefined = 'predefined',
  Template = 'template',
  PredefinedComponent = 'predefined-component',
}

export interface WizardStep {
  id: string;
  type: WizardStepType;
  label: string;
  // For predefined steps, this is the component name; for template, the page id
  ref: string;
  // Optional: validation, etc.
  validate?: (state: any) => boolean;
}

export interface WizardJourney {
  id: string;
  label: string;
  slug?: string;
  steps: WizardStep[];
  description?: string;
  
  // Localization configuration for the journey
  localization?: LocalizationConfig;
}

export interface WizardStepProps {
  step: WizardStep;
  state: any;
  setState: (s: any) => void;
  goNext: () => void;
  goBack: () => void;
}
