export interface CustomerInput {
  name: string;
  document: string;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  document: string;
  phone: string;
  createdAt: Date;
}

