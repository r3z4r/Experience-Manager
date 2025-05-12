// ReviewSubmitStep: Predefined step for reviewing and submitting
'use client';
import React from 'react';
import { WizardStepProps } from '@/lib/types/wizard';

export const ReviewSubmitStep: React.FC<WizardStepProps> = ({ goBack }) => {
  // TODO: Show summary of selections and submit action
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Review & Submit</h2>
      <p>Review summary goes here.</p>
      <div className="flex gap-2">
        <button className="btn btn-secondary" onClick={goBack}>Back</button>
        <button className="btn btn-primary">Submit</button>
      </div>
    </div>
  );
};
