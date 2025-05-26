export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleType: string;
  ownerName: string;
  contactNumber: string;
  createdAt: string | number;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  status: "Available" | "Occupied" | string;
  type: "Standard" | "EV Charger" | "Disabled" | string;
  vehicleId?: string | null;
  createdAt: string | number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  zipCode?: string;
  state?: string;
}
