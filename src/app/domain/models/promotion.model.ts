export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_NIGHTS = 'FREE_NIGHTS'
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  type: PromotionType;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableHotels: number[];
  minimumNights?: number;
  maximumDiscount?: number;
  createdAt: Date;
  updatedAt: Date;
}