export type MovementType = 'in' | 'out' | 'adjust'
export type MovementReason = 'purchase' | 'sale' | 'damage' | 'loss' | 'correction' | 'transfer'

export interface Product {
  id: string
  org_id: string
  sku: string
  name: string
  category: string
  unit: string
  price: number
  cost: number
  min_stock: number
  created_at: string
}

export interface Location {
  id: string
  org_id: string
  name: string
}

export interface StockLevel {
  product_id: string
  location_id: string
  qty: number
}

export interface Movement {
  id: string
  org_id: string
  product_id: string
  location_id: string
  type: MovementType
  qty: number
  reason: MovementReason
  user_id: string
  created_at: string
}

export interface Supplier {
  id: string
  org_id: string
  name: string
  contact?: string
  email?: string
}
