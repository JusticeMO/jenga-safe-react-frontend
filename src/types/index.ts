export type UserRole = 'tenant' | 'landlord';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hasAssignedProperty?: boolean;
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
