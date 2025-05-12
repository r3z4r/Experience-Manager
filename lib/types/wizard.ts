// Types for Wizard Engine and Steps
import { User, Page } from '@/payload-types';

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
}

export interface WizardStepProps {
  step: WizardStep;
  state: any;
  setState: (s: any) => void;
  goNext: () => void;
  goBack: () => void;
}
