export type UserRole = 'tenant' | 'landlord';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_picture?: string;
  has_assigned_property?: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  occupiedUnits: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  type: string;
  imageUrl: string;
  available: boolean;
  vacating: boolean;
  vacatingDate?: string;
  location: {
    lat: number;
    lng: number;
  };
  images: string[];
  vrTourUrl?: string;
  videoTourUrl?: string;
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
  name: string;
  role: string;
  avatar: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  unread: number;
  time: string;
  lastMessage: string;
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
  status: 'pending' | 'in-progress' | 'resolved' | 'Completed' | 'In Progress' | 'Pending';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInfo {
  propertyName: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  depositAmount: number;
  nextDueDate: string;
  firstPaymentDue: boolean;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
  type: string;
  status: string;
  sender: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  description: string;
  number: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface Complaint {
  id: string;
  complaintType: string;
  subject: string;
  description: string;
  urgencyLevel: string;
  contactMethod: string;
  status: string;
  createdAt: string;
}

export interface GarbageServiceHistory {
  month: string;
  amount: number;
  paymentDate: string;
  status: string;
}

export type Dashboard = Record<string, unknown>;
export type DashboardStats = Record<string, unknown>;
export type Unit = Record<string, unknown>;
export type Report = Record<string, unknown>;

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isSelf: boolean;
  avatar: string;
}

export interface WaterUsageHistory {
  month: string;
  units: number;
  amount: number;
  status: string;
}
