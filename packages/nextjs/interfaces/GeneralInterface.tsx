export interface EmployeeWithoutPasswordInterface {
  employee_id: string;
  parcel_hub_id: string;
  email: string;
}

export interface CustomerInterface {
  name: string;
  email: string;
  password: string;
}

export interface CustomerWithoutPasswordInterface {
  name: string;
  email: string;
}

export interface ParcelHubInterface {
  parcel_hub_id: string;
  parcel_hub_name: string;
  parcel_hub_address: string;
  state: string;
  country: string;
  parcel_hub_operating_level: string;
}

export interface ParcelInterface {
  tracking_number: string;
  parcel_weight_kg: number;
  parcel_dimensions_cm: {
    length: number;
    width: number;
    height: number;
  };
  parcel_estimated_delivery: string;
  parcel_type: string;
  is_fragile: boolean;
  extra_comment: string | "";
  sender: {
    name: string;
    phone_number: string;
    email: string;
  };
  recipient: {
    name: string;
    phone_number: string;
    email: string;
  };
  final_destination: {
    street: string;
    area: string;
    postal_code: string;
    state: string;
    country: string;
  };
  current_location: string;
  pathway: Array<{
    parcel_hub_id: string;
    received_time?: string;
    dispatch_time: string | null;
    photo_url: string | null;
    sender?: {
      signature_hash: string;
    };
    employee: {
      employee_id: string;
      signature_hash: string | null;
    };
    verification_hash: string | null;
  }>;
  final_delivery: {
    received_time: string;
    photo_url: string;
    customer_signature_hash: string | null;
    verification_hash: string | null;
  } | null;
}
