export interface RoomCapacity {
  adults: number;
  children: number;
  total: number;
}

export interface RoomSize {
  area: number;
  unit: string;
}

export interface Bed {
  type: string;
  count: number;
}

export interface BedConfiguration {
  beds: Bed[];
  totalBeds: number;
}

export interface Pricing {
  basePrice: number;
  currency: string;
  taxRate: number;
  discounts: any[];
}

export interface Availability {
  isAvailable: boolean;
  isOccupied: boolean;
  maintenanceStatus: string;
}

export interface RoomFeatures {
  hasBalcony: boolean;
  hasKitchen: boolean;
  hasLivingRoom: boolean;
  hasBathroom: boolean;
  hasAirConditioning: boolean;
  hasWifi: boolean;
  hasTv: boolean;
  hasMinibar: boolean;
  hasSeaView: boolean;
  hasCityView: boolean;
  isAccessible: boolean;
  allowsSmoking: boolean;
  allowsPets: boolean;
}

export interface Room {
  id: string;
  hotelId: string;
  number: string;
  type: string;
  floor: number;
  capacity: RoomCapacity;
  size: RoomSize;
  bedConfiguration: BedConfiguration;
  amenities: string[];
  pricing: Pricing;
  availability: Availability;
  features: RoomFeatures;
  images: string[];
  description: string;
  housekeepingNotes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}