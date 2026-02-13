/**
 * Money Mastery Game Types
 * TypeScript interfaces for shop items, purchase tracking, and game state
 */

export interface ShopItem {
  id: string;
  name: string;
  type: 'asset' | 'consumption';
  price: number;
  incomePerCycle?: number; // Only for assets
  imageUrl: string;
  description: string;
}

export interface PlantPotState {
  id: number;
  watered: boolean;
  coinSpawned: boolean;
  coinCollected: boolean;
}

export interface MoneyMetrics {
  totalEarned: number;
  assetsOwned: number;
  consumptionPurchases: number;
  gardenCyclesCompleted: number;
}

export interface PurchaseEvent {
  itemId: string;
  itemName: string;
  price: number;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: number;
}
