export interface ExtraItem {
  name: string;
}

export interface Variation {
  size: string;
  deliveryPrice: number;
  collectionPrice?: number;
}

export interface Option {
  name: string;
  price: number;
  linkedGroups?: string[]; // Groups this option belongs to
  linkedProducts?: string[];
}

export interface OptionGroup {
  name: string;
  isOptional: boolean;
  isRequired?: boolean;
  selectionLimit?: number;
  options: Option[];
  linkedProducts?: string[];
}

export interface Product {
  _id?: string;
  image: string;
  // image?: File | null;
  productName: string;
  price: number;
  quantity: number;
  description?: string;
  category?: string;
  extras: ExtraItem[];
  variations?: Variation[];
  dietaryInfo?: {
    is18Plus: boolean;
    isSpicy: boolean;
    isVegan: boolean;
    isVegetarian: boolean;
  };
  optionGroups?: OptionGroup[];
}

// Interface for the Edit Item Form specifically
export interface EditItemForm {
  productName: string;
  description: string;
  image: string;
  category: string;
  variations: Variation[];
  dietaryInfo: {
    is18Plus: boolean;
    isSpicy: boolean;
    isVegan: boolean;
    isVegetarian: boolean;
  };
  optionGroups: OptionGroup[];
}

export type DealAction = 'existing' | 'new';

export interface Deal {
  _id: string;
  dealName: string;
  productIds: string[] | Product[];
  status?: 'active' | 'inactive';
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
