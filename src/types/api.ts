import { User, Property, Payment, Message, MaintenanceRequest, Bill } from ".";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
  user?: User;
}
