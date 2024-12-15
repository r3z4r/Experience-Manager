// Template Status
export const TEMPLATE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export type TemplateStatus = (typeof TEMPLATE_STATUS)[keyof typeof TEMPLATE_STATUS]

// Access Visibility
export const ACCESS_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  RESTRICTED: 'restricted',
} as const

export type AccessVisibility = (typeof ACCESS_VISIBILITY)[keyof typeof ACCESS_VISIBILITY]

// Component Types
export const COMPONENT_TYPE = {
  STRIPE_PAYMENT: 'stripe-payment',
  SIGN_IN: 'sign-in',
  CUSTOM_FORM: 'custom-form',
} as const

export type ComponentType = (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE]

// Status Configuration Type
export interface StatusConfig {
  label: string
  color: string
  description: string
}

// Status Configurations
export const STATUS_CONFIGS: Record<TemplateStatus, StatusConfig> = {
  [TEMPLATE_STATUS.DRAFT]: {
    label: 'Draft',
    color: 'yellow',
    description: 'Template is in draft mode',
  },
  [TEMPLATE_STATUS.PUBLISHED]: {
    label: 'Published',
    color: 'green',
    description: 'Template is live and published',
  },
  [TEMPLATE_STATUS.ARCHIVED]: {
    label: 'Archived',
    color: 'gray',
    description: 'Template is archived',
  },
}
