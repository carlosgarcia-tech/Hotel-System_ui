export interface HotelAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface HotelAmenity {
  id: string;
  name: string;
  category: "basic" | "premium" | "luxury";
  isActive: boolean;
}

export interface HotelContact {
  phone: string;
  email: string;
  website?: string;
}

export interface HotelRating {
  stars: number;
  reviewCount: number;
  averageRating: number;
}

export interface HotelPriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: HotelAddress;
  contact: HotelContact;
  amenities: HotelAmenity[];
  rating: HotelRating;
  totalRooms: number;
  availableRooms: number;
  priceRange: HotelPriceRange;
  images: string[];
  isActive: boolean;
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelSearchCriteria {
  name?: string;
  minRating?: number;
  maxRating?: number;
  amenities?: string[];
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    nearCoordinates?: {
      latitude: number;
      longitude: number;
      radiusKm: number;
    };
  };
  isActive?: boolean;
  minAvailableRooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
  policies?: string[];
}

export interface HotelApiResponse {
  success: boolean;
  message: string;
  data: Hotel[];
  timestamp: string;
}