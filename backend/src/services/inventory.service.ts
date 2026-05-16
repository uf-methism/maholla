import prisma from '../config/prismaClient';

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface MatchedItem extends ParsedItem {
  productId?: string;
  price?: number;
  isAvailable: boolean;
  matchedName?: string;
}

export const inventoryService = {
  /**
   * Matches AI-parsed items against the vendor's actual database inventory.
   * Checks if the item exists and if there is sufficient stock.
   */
  matchItemsWithInventory: async (vendorId: string, parsedItems: ParsedItem[]): Promise<MatchedItem[]> => {
    const matchedItems: MatchedItem[] = [];

    for (const item of parsedItems) {
      // Split by words and find the best match (simple approach for now)
      // A robust system would use Postgres pg_trgm or full-text search.
      // For this prototype, we'll use a basic ILIKE contains.
      
      const products = await prisma.product.findMany({
        where: {
          vendorId,
          name: { contains: item.name, mode: 'insensitive' },
          deletedAt: null,
        },
        orderBy: { stockQuantity: 'desc' }, // Prioritize items with stock
      });

      if (products.length > 0) {
        const bestMatch = products[0];
        
        // We consider it available if they have enough stock.
        const isAvailable = bestMatch.stockQuantity >= item.quantity;
        
        matchedItems.push({
          ...item,
          productId: bestMatch.id,
          price: bestMatch.price,
          matchedName: bestMatch.name,
          isAvailable,
        });
      } else {
        // Product does not exist in vendor's catalog
        matchedItems.push({
          ...item,
          isAvailable: false,
        });
      }
    }

    return matchedItems;
  }
};
