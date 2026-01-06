export interface Variation {
  id: string;
  name: string;
  price: number;
}

export interface Option {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
  linkedToItems: string[];
}

export interface OptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  options: string[];
  linkedToItems: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  variations: Variation[];
  dietaryTags: string[];
  isApproved: boolean;
}
