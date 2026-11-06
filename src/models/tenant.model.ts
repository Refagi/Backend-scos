export interface UpdateSellerTenantBody {
  storeName?:   string
  description?: string | null
  location?:    string
  isOpen?:      boolean
  openLabel?:   string
  logo?:        string | null
  image?:       string | null
  qrisImage?:   string | null
}
