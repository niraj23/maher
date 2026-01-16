import { ProductWithStore } from '@/types';

/**
 * Get product URL - use stored URL if available, otherwise generate one
 */
export function getProductUrl(product: ProductWithStore): string | null {
  // If product has a stored URL, use it
  if (product.product_url) {
    return product.product_url;
  }
  
  // Otherwise, try to generate one based on store and product name
  const storeName = product.store.name.toLowerCase();
  
  if (storeName.includes('real real')) {
    // Generate The Real Real URL from product name
    // Convert product name to URL-friendly slug
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .trim();
    
    // Try to determine category from product name
    let category = 'men';
    const nameLower = product.name.toLowerCase();
    
    if (nameLower.includes('sneaker') || nameLower.includes('shoe') || nameLower.includes('yeezy')) {
      category = 'men/shoes/sneakers';
    } else if (nameLower.includes('jacket') || nameLower.includes('coat')) {
      category = 'men/clothing/jackets';
    } else if (nameLower.includes('shirt') || nameLower.includes('tee') || nameLower.includes('t-shirt')) {
      category = 'men/clothing/shirts';
    } else if (nameLower.includes('pant') || nameLower.includes('jean') || nameLower.includes('trouser')) {
      category = 'men/clothing/pants';
    } else if (nameLower.includes('sweater') || nameLower.includes('hoodie') || nameLower.includes('pullover')) {
      category = 'men/clothing/sweaters';
    } else if (nameLower.includes('watch')) {
      category = 'men/watches';
    } else if (nameLower.includes('bag') || nameLower.includes('backpack') || nameLower.includes('briefcase')) {
      category = 'men/accessories/bags';
    }
    
    return `https://www.therealreal.com/products/${category}/${slug}`;
  }
  
  // For other stores, return null (no auto-generated URL)
  return null;
}
