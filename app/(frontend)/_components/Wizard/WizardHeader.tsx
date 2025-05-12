// Reusable header for Wizard pages, matching Xmanager TemplateList styling
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface WizardHeaderProps {
  title?: string;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ title = 'Wizard Journeys' }) => (
  <header className="template-header">
    <div className="header-logo">
      <Image
        src="/xpm/logo.webp"
        alt="Logo"
        width={120}
        height={120}
        className="object-contain"
      />
      <span className="header-title">{title}</span>
    </div>

    <Link href="/wizard" className="button-primary-outline button-md">
      Journeys List
    </Link>
  </header>
);
