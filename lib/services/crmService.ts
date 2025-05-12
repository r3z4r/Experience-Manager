// Service functions for CRM API

export interface CustomerInfo {
  id: string
  name: string
  email?: string
  [key: string]: any
}

export interface ServiceRequestResult {
  success: boolean
  requestId?: string
  error?: string
}

// TODO: Replace with actual API endpoint
export async function getCustomerInfo(customerId: string): Promise<CustomerInfo> {
  const res = await fetch(`/api/crm/customers/${customerId}`)
  if (!res.ok) throw new Error('Failed to fetch customer info')
  return res.json()
}

// Optional, for e2e
export async function addVasService(
  customerId: string,
  vasId: string,
): Promise<ServiceRequestResult> {
  const res = await fetch(`/api/crm/customers/${customerId}/vas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vasId }),
  })
  return res.json()
}
