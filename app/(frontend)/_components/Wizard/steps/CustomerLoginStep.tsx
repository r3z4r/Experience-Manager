// CustomerLoginStep: Predefined step for customer login
'use client';
import React from 'react';
import { WizardStepProps } from '@/lib/types/wizard';

export const CustomerLoginStep: React.FC<WizardStepProps> = ({ goNext }) => {
  // TODO: Implement login logic and UI
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Customer Login</h2>
      <p>Login form goes here.</p>
      <button className="btn btn-primary" onClick={goNext}>Continue</button>
    </div>
  );
};
