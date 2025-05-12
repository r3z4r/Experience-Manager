// Service functions for Product Catalogue Manager API
export interface Product {
  id: string
  name: string
  description?: string
  price?: number
  [key: string]: any
}

export interface VasOption {
  id: string
  name: string
  description?: string
  [key: string]: any
}

// TODO: Replace with actual API endpoint
export async function getProducts(): Promise<Product[]> {
  // Example fetch, replace URL
  const res = await fetch('/api/product-catalogue/products')
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  // Normalize as needed
  return data.products as Product[]
}

export async function getVasOptions(): Promise<VasOption[]> {
  const res = await fetch('/api/product-catalogue/vas-options')
  if (!res.ok) throw new Error('Failed to fetch VAS options')
  const data = await res.json()
  return data.options as VasOption[]
}
