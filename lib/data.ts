export type UserRole = 'tenant' | 'landlord';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  occupiedUnits: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'overdue';
  method?: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface Bill {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

export const mockTenant: User = {
  id: 'tenant1',
  name: 'John Tenant',
  email: 'tenant@example.com',
  role: 'tenant',
  profilePicture: null, // Can be updated in settings
};

export const mockLandlord: User = {
  id: 'landlord1',
  name: 'Alice Landlord',
  email: 'landlord@example.com',
  role: 'landlord',
  profilePicture: null,
};

export const mockPropertiesData: Property[] = [
  {
    id: 'prop1',
    name: 'Cozy Apartment',
    address: '123 Main St, Anytown',
    units: 5,
    occupiedUnits: 3,
  },
  {
    id: 'prop2',
    name: 'Luxury Villa',
    address: '456 Ocean View Dr, Coastville',
    units: 1,
    occupiedUnits: 1,
  },
];

export const mockBills: Bill[] = [
  {
    id: 'bill1',
    type: 'Rent',
    amount: 1200,
    dueDate: '2023-08-01',
    status: 'unpaid',
  },
  {
    id: 'bill2',
    type: 'Electricity',
    amount: 80,
    dueDate: '2023-07-25',
    status: 'paid',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    from: 'Landlord',
    subject: 'Important Notice',
    content: 'Please remember to pay your rent on time.',
    date: '2023-07-15',
    read: false,
  },
  {
    id: 'msg2',
    from: 'Support',
    subject: 'Maintenance Update',
    content: 'Your maintenance request has been resolved.',
    date: '2023-07-10',
    read: true,
  },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'req1',
    title: 'Leaky Faucet',
    description: 'The faucet in the bathroom is constantly dripping.',
    date: '2023-07-20',
    status: 'in-progress',
  },
  {
    id: 'req2',
    title: 'Broken Window',
    description: 'A window in the living room is cracked.',
    date: '2023-07-10',
    status: 'resolved',
  },
];

export const mockPayments = [
  {
    id: "pay1",
    date: "2025-03-01",
    amount: 25000,
    description: "Rent payment for March 2025",
    status: "completed" as const,
    method: "Bank Transfer"
  },
  {
    id: "pay2",
    date: "2025-02-01",
    amount: 25000,
    description: "Rent payment for February 2025",
    status: "completed" as const,
    method: "Mobile Money"
  },
  {
    id: "pay3",
    date: "2025-01-01",
    amount: 25000,
    description: "Rent payment for January 2025",
    status: "completed" as const,
    method: "Bank Transfer"
  },
  {
    id: "pay4",
    date: "2025-04-01",
    amount: 25000,
    description: "Rent payment for April 2025",
    status: "pending" as const,
    method: "Credit Card"
  },
  {
    id: "pay5",
    date: "2024-12-01",
    amount: 1200,
    description: "Water bill for December 2024",
    status: "completed" as const,
    method: "Mobile Money"
  },
  {
    id: "pay6",
    date: "2025-01-15",
    amount: 1500,
    description: "Water bill for January 2025",
    status: "overdue" as const,
    method: undefined
  }
];

export const mockProperties = [
  {
    id: "prop1",
    name: "Sunshine Apartments",
    address: "123 Main Street, Nairobi",
    units: 12,
    occupiedUnits: 10,
  },
  {
    id: "prop2",
    name: "Riverside Villas",
    address: "456 Park Avenue, Mombasa",
    units: 8,
    occupiedUnits: 6,
  },
  {
    id: "prop3",
    name: "Mountain View Residences",
    address: "789 Garden Road, Nakuru",
    units: 20,
    occupiedUnits: 15,
  },
  {
    id: "prop4",
    name: "City Center Apartments",
    address: "101 Urban Street, Nairobi",
    units: 16,
    occupiedUnits: 14,
  },
];
