/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: drivers
 * Interface for Drivers
 */
export interface Drivers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  contactNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  licenseNumber?: string;
  /** @wixFieldType date */
  licenseExpiryDate?: Date | string;
  /** @wixFieldType text */
  licenseStatus?: string;
  /** @wixFieldType number */
  safetyScore?: number;
  /** @wixFieldType number */
  tripCompletionRate?: number;
  /** @wixFieldType text */
  dutyStatus?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePicture?: string;
}


/**
 * Collection ID: expenses
 * Interface for Expenses
 */
export interface Expenses {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  expenseType?: string;
  /** @wixFieldType date */
  date?: Date | string;
  /** @wixFieldType number */
  amount?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  fuelQuantityLiters?: number;
  /** @wixFieldType number */
  odometerReading?: number;
  /** @wixFieldType text */
  vehicleLicensePlate?: string;
}


/**
 * Collection ID: maintenancelogs
 * Interface for MaintenanceLogs
 */
export interface MaintenanceLogs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  vehicleLicensePlate?: string;
  /** @wixFieldType text */
  maintenanceType?: string;
  /** @wixFieldType datetime */
  serviceDate?: Date | string;
  /** @wixFieldType text */
  serviceStatus?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  cost?: number;
  /** @wixFieldType text */
  mechanicName?: string;
  /** @wixFieldType date */
  nextServiceDate?: Date | string;
}


/**
 * Collection ID: trips
 * Interface for Trips
 */
export interface Trips {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  tripName?: string;
  /** @wixFieldType text */
  assignedVehicleId?: string;
  /** @wixFieldType text */
  assignedDriverId?: string;
  /** @wixFieldType text */
  cargoDescription?: string;
  /** @wixFieldType number */
  cargoWeightKg?: number;
  /** @wixFieldType text */
  tripStatus?: string;
  /** @wixFieldType text */
  departureLocation?: string;
  /** @wixFieldType text */
  destinationLocation?: string;
  /** @wixFieldType datetime */
  scheduledDepartureTime?: Date | string;
  /** @wixFieldType datetime */
  scheduledArrivalTime?: Date | string;
}


/**
 * Collection ID: vehicles
 * Interface for Vehicles
 */
export interface Vehicles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  model?: string;
  /** @wixFieldType text */
  licensePlate?: string;
  /** @wixFieldType text */
  vehicleType?: string;
  /** @wixFieldType number */
  maxLoadCapacity?: number;
  /** @wixFieldType number */
  odometerReading?: number;
  /** @wixFieldType text */
  status?: string;
}
