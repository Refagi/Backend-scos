import type { OrderType, PaymentMethod } from '@/generated/prisma/client.js';

/** "Dine In · Meja A5" atau "Takeaway" */
export const orderTypeLabel = (type: OrderType, tableNumber?: string | null): string =>
  type === 'dine_in' ? `Dine In${tableNumber ? ` · Meja ${tableNumber}` : ''}` : 'Takeaway';

export const paymentMethodLabel = (method: PaymentMethod): string => (method === 'cash' ? 'Tunai' : 'QRIS');
