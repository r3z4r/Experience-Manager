// ProductSelectionStep: Predefined step for product/VAS selection
'use client';
import React from 'react';
import { WizardStepProps } from '@/lib/types/wizard';

export const ProductSelectionStep: React.FC<WizardStepProps> = ({ goNext, goBack }) => {
  // TODO: Fetch products and VAS options, render selection UI
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Select Product or VAS</h2>
      <p>Product and VAS selection UI goes here.</p>
      <div className="flex gap-2">
        <button className="btn btn-secondary" onClick={goBack}>Back</button>
        <button className="btn btn-primary" onClick={goNext}>Continue</button>
      </div>
    </div>
  );
};
